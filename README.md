# Identity Access Control

This is an experimental project to implement permission based user access control management in **Golang** X  **NextJS**. This project is using **Google** & **Microsoft** signing feature to allow user to login with their google and microsoft account.



## Purpose

Purpose of this project is to demonstrate how we can assign specific operation access to specific people dynamically without changing the source code. Policy based authorization allow user to assign only specific operation (Create/Read/Update/Delete) to a specific policy and assign this policy to user(s)

Morever a user can have multiple account to login; like credential login, Google login, Microsoft login and so on. This system allow to assign multiple account to (to login) one user, so that user can login into the system with any of them.



## How It Works

System will allow to user to setup master data by providing an admin credential. This admin credential has all CRUD operation access. To setup admin credential 

```go
go run main.go -dbmigration -setup
```



* `-dbmigration` create all necessary database models/tables
* `-setup` to create master policy, master account credential 



**Default Credential: admin | admin** 
