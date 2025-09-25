"""
Public API for defining tasks.
"""

load("//task/private:cmd.bzl", _cmd = "cmd")
load("//task/private:py_binary_cmd.bzl", _py_binary_cmd = "py_binary_cmd")
load("//task/private:task.bzl", _task = "task", _task_test = "task_test")

cmd = _cmd
task = _task
task_test = _task_test
py_binary_cmd = _py_binary_cmd
