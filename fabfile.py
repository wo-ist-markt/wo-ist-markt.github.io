""" [fabric](fabfile.org) script for deploying the app to a server

    This script can be used to deploy the app.
    One needs to call `deploy` with the fabric cli.
    It compresses the app into a .tar.gz file, uploads and unpacks it
    and sets a symlink to the latest revision.

    It is also possible to use the `list_revisions` command to see which
    revisions are published to the server.
 """
from fabric import task

BASE_PATH = '/home/deploy/versions'


@task
def deploy(c):
    current_revision = c.local('git rev-parse HEAD', warn=True).stdout.strip()
    create_artifact(c, current_revision)
    upload_artifact(c, current_revision)
    make_active(c, current_revision)


def create_artifact(c, current_revision):
    """ compress all files into a .tar.gz archive for uploading """
    archive_path = '/tmp/{revision}.tar.gz'.format(revision=current_revision)
    c.local('tar -czf {archive_path} --exclude=.git *'.format(archive_path=archive_path))


def upload_artifact(c, revision):
    """ upload the archive to the server and extract it """
    # we upload the file from the local /tmp to the remote /tmp dir
    tmp_path = '/tmp/{revision}.tar.gz'.format(revision=revision)
    c.put(tmp_path, tmp_path)

    destination_path = '{base}/{revision}'.format(base=BASE_PATH,
                                                  revision=revision)
    untar(c, tmp_path, destination_path)

    # remove both local and remote archives
    c.run('rm {}'.format(tmp_path))
    c.local('rm {}'.format(tmp_path))


def untar(c, source_path, destination_path):
    c.run('mkdir -p %s' % destination_path)
    c.run('tar xfz %s -C %s' % (source_path, destination_path))


def make_active(c, revision):
    """ change the `newest` symlink to point to this revision """
    c.run('ln -sfn {base}/{revision}/ {base}/newest'.format(base=BASE_PATH,
                                                            revision=revision))


@task
def list_versions(c):
    c.run('ls -l {base}'.format(base=BASE_PATH))
