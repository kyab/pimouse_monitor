#!/usr/bin/env python
import rospy, os
import http.server
import socketserver

def kill():
    os.system("kill -KILL " + str(os.getpid()))

os.chdir(os.path.dirname(__file__) + "/../contents")
rospy.init_node("webserver")
rospy.on_shutdown(kill)

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("",PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()

    

