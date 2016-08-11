""" [fabric](fabfile.org) script for deploying the app to a server

    This script can be used to deploy the app.
    One needs to call `deploy` with the fabric cli.
    It compresses the app into a .tar.gz file, uploads and unpacks it
    and sets a symlink to the latest revision.

    It is also possible to use the `list_revisions` command to see which
    revisions are published to the server.
 """
from fabric.api import run, env, local, put, cd

BASE_PATH = '/home/deploy/versions'

def deploy():
    current_revision = local('git rev-parse HEAD', capture=True)
    create_artifact(current_revision)
    upload_artifact(current_revision)
    make_active(current_revision)

def create_artifact(current_revision):
    """ compress all files into a .tar.gz archive for uploading """
    archive_path = '/tmp/{revision}.tar.gz'.format(revision=current_revision)
    local('tar -czf {archive_path} --exclude=.git *'.format(archive_path=archive_path))

def upload_artifact(revision):
    """ upload the archive to the server and extract it """
    # we upload the file from the local /tmp to the remote /tmp dir
    tmp_path = '/tmp/{revision}.tar.gz'.format(revision=revision)
    put(tmp_path, tmp_path)

    destination_path = '{base}/{revision}'.format(base=BASE_PATH,
                                                  revision=revision)
    untar(tmp_path, destination_path)

    # remove both local and remote archives
    run('rm {}'.format(tmp_path))
    local('rm {}'.format(tmp_path))

def untar(source_path, destination_path):
    run('mkdir -p %s' % destination_path)
    run('tar xfz %s -C %s' % (source_path, destination_path))

def make_active(revision):
    """ change the `newest` symlink to point to this revision """
    run('ln -sfn {base}/{revision}/ {base}/newest'.format(base=BASE_PATH,
                                                          revision=revision))

def list_versions():
    run('ls -l {base}'.format(base=BASE_PATH))
