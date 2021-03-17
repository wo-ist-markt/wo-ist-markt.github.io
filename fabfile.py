# pylint: disable=invalid-name

""" [fabric](fabfile.org) script for deploying the app to a server

    This script can be used to deploy the app.
    One needs to call `deploy` with the fabric cli.
    It compresses the app into a .tar.gz file, uploads and unpacks it
    and sets a symlink to the latest revision.

    It is also possible to use the `list_revisions` command to see which
    revisions are published to the server.
 """
from fabric import task

BASE_PATH = "/home/deploy/versions"


@task
def deploy(c):
    """ runs all steps of the deployment """
    current_revision = c.local("git rev-parse HEAD", warn=True).stdout.strip()
    create_artifact(c, current_revision)
    upload_artifact(c, current_revision)
    make_active(c, current_revision)


def create_artifact(c, current_revision):
    """ compress all files into a .tar.gz archive for uploading """
    archive_path = f"/tmp/{current_revision}.tar.gz"
    c.local(f"tar -czf {archive_path} --exclude=.git *")


def upload_artifact(c, revision):
    """ upload the archive to the server and extract it """
    # we upload the file from the local /tmp to the remote /tmp dir
    tmp_path = f"/tmp/{revision}.tar.gz"
    c.put(tmp_path, tmp_path)

    destination_path = f"{BASE_PATH}/{revision}"
    untar(c, tmp_path, destination_path)

    # remove both local and remote archives
    c.run(f"rm {tmp_path}")
    c.local(f"rm {tmp_path}")


def untar(c, source_path, destination_path):
    """ unpacks the archive from the source path into the destination dir """
    c.run(f"mkdir -p {destination_path}")
    c.run(f"tar xfz {source_path} -C {destination_path}")


def make_active(c, revision):
    """ change the `newest` symlink to point to this revision """
    c.run(f"ln -sfn {BASE_PATH}/{revision}/ {BASE_PATH}/newest")


@task
def list_versions(c):
    """ outputs a list of published versions found in the base path """
    c.run(f"ls -l {BASE_PATH}")
