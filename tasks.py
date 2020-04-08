from invoke import task
import os

BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'mopidy-juliana')

@task
def deploy(c, env="live", deploy=True, migrate=False):
    with c.cd(os.path.join(BASE_DIR)):
        c.run('rsync -avz juliana-nuxt/dist/* mopidy_juliana/static')
        c.run('git add mopidy_juliana/static')
        try:
            c.run('git commit -m "Static commit"')
        except:
            pass
        c.run('git push')
        c.run('ssh music "cd projects/mopidy-juliana/ && git pull && sudo python3 setup.py install &&  sudo /etc/init.d/mopidy restart"')


@task
def make_frontend(c, env="live", deploy=True, migrate=False):
    with c.cd(os.path.join(BASE_DIR, 'juliana-nuxt')):
        c.run('export NODE_ENV=production && npm run build')

