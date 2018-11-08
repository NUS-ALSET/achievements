"""
this python3 script helps to automate the workflow for prod branch deployment
before you run this file, please ensure:
you are have pulled latest code when on master
"""

import os
import sys
import shutil
import subprocess
import time
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, HTTPServer

def check_proc_status(p):
    """check the subprocess status"""
    while True:
        time.sleep(1)
        if p.poll() is None:
            print(p, " stil running")
        elif p is None:
            print("something wrong with the subprocess, terminating")
            sys.exit()
        else:
            stdout, stderr = p.communicate()
            out = stdout.decode('ascii')
            if stderr == b'':
                err = "No Error"
            else:
                err = stderr.decode('ascii')
            return (out, err)


# Step 0: check whether at achievements dir
print("########## Step 0 check working dir ##########")
if os.path.isdir('./public'):
    if os.path.isdir('./.git'):
        print("Currently at ", os.getcwd())
else:
    print("please change to the correct achievements main dir")
    sys.exit()

# Step 1: git pull and merge
print("########## Step 1 git ##########")

merge_time = datetime.now().strftime('%Y-%m-%d %H:%M')

commd_merge = ['git',
              'merge',
              'master',
              '-m',
              'preparing for %s deployment' %merge_time
              ]

proc_git_m = subprocess.Popen(
                 commd_merge,
                 stdout=subprocess.PIPE,
                 stderr=subprocess.PIPE
             )

(git_out, git_err) = check_proc_status(proc_git_m)
print("git merge output:\n", git_out)
print("git merge error:\n", git_err)


# Step 2: remove node_modules/
print("########## Step 2 clean up ##########")

nm_path = "node_modules/"

if os.path.isdir(nm_path):
    try:
        shutil.rmtree(nm_path, ignore_errors=True)
        print("node_modules removed")
    except Exception as e:
        print(e)


# Step 3: remove npm/yarn lock files
print("########## Step 3 some more clean up ##########")

lock_files = ["package-lock.json", "yarn.lock"]

for f in lock_files:
    if os.path.isfile(f):
        os.remove(f)
        print("{} removed".format(f))



# Step 4: yarn install
print("########## Step 4 yarn install ##########")

proc_yarn_i = subprocess.Popen(
            ['yarn', 'install'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

(yarn_i_out, yarn_i_err) = check_proc_status(proc_yarn_i)
print("yarn install output:\n", yarn_i_out)
print("yarn install error:\n", yarn_i_err)


# Step 5: yarn build
print("########## Step 5 yarn build ##########")

proc_yarn_b = subprocess.Popen(
            ['yarn', 'run', 'build'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

(yarn_b_out, yarn_b_err) = check_proc_status(proc_yarn_b)
print("yarn build output:\n", yarn_b_out)
print("yarn build error:\n", yarn_b_err)


# Step 6: test build in python server
print("########## Step 6 SimpleHTTP server with build ##########")

os.chdir('./build')
server_address = ('', 8000)
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
print("Now open browser with localhost:8000")
httpd.serve_forever()
