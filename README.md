# Api Demo

A demo project that shows how to implement a backend service with Node.js and MySQL as DBMS. It is also available as a [Docker container](https://hub.docker.com/r/micpap/api-demo).

## Features

- Shows how to use Node.js in order to create a backend service that exposes REST API
- Uses Docker in order to allow to execute the application in a dedicated container


## Tech

Dillinger uses a number of open source projects to work properly:

- [Node.js](https://nodejs.org/) - HTML enhanced for web apps!
- [MySQL](https://www.mysql.com/) - an open-source relational database management system (RDBMS)
- [Docker](https://www.docker.com/) - a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers
- [express](https://www.npmjs.com/package/express) - fast, unopinionated, minimalist web framework for node
- [debug](https://www.npmjs.com/package/debug) - a tiny JavaScript debugging utility modelled after Node.js core's debugging technique
- [joi](https://www.npmjs.com/package/joi) - the most powerful schema description language and data validator for JavaScript
- [mysql2](https://www.npmjs.com/package/mysql2) - MySQL client for Node.js with focus on performance
- [underscore](https://www.npmjs.com/package/underscore) - Underscore.js is a utility-belt library for JavaScript that provides support for the usual functional suspects (each, map, reduce, filter...) without extending any core JavaScript objects.
- [nodemon](https://www.npmjs.com/package/nodemon) - a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Installation

Api Demo requires [Node.js](https://nodejs.org/) v14+ to run, [MySQL](https://www.mysql.com/) v8+ and [Docker](https://www.docker.com/) v20+ to use the container.

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/michele-paparella/api-demo.git
cd api-demo
npm i
npm run dev
```

# REST API

The main REST API of Api Demo are shown below.
description | URI | method | body | body/query string allowed values | output | 
--- | --- | --- | --- | --- | --- |
Project creation | /api/project/new | POST | { "title": <projectTitle>, "jobs": [{"price": <price>}] } | _projectTitle_: not empty string; _price_: number | { "result": <id> }
Job creation | /api/job/new | POST | { "projectId": <projectId>, "job": {"price":<price>} } | _projectId_: project id; _price_: number| { "result": <id> }
Get project by id | /api/project/<id> | GET |  | _id_: project id| {    "result": {        "id":<projectId>,        "title": <projectTitle>,        "jobs": [            {                "id": <jobId>,           "creationDate": <creationDate>,                "price": <jobPrice>,                "status": <jobStatus>            }   ] } }
Get all projects | /api/projects | GET |  |  | {    "result": {        "id":<projectId>,        "title": <projectTitle>,        "jobs": [            {                "id": <jobId>,           "creationDate": <creationDate>,                "price": <jobPrice>,                "status": <jobStatus>            }   ] } }
Get all jobs|/api/jobs | GET |  | | {   "result": [        {            "id": <jobID>,            "creationDate": <creationDate>,"price": <jobPrice>,            "status": <jobStatus>        } ] }
Change job status | /api/job/<id> | PUT | { "status": _status_ } |  _id_: job id; _status_: can be one of the following values: _in preparation_, _in progress_, _cancelled_, _delivered_ | { "result": '' }
Get all jobs by status |/api/jobs?status=<status> | GET | _status_: can be one of the following values: _in preparation_, _in progress_, _cancelled_, _delivered_ | {   "result": [        {            "id": <jobID>,            "creationDate": <creationDate>,"price": <jobPrice>,            "status": <jobStatus>        } ] }
Get all jobs ordered by creation date |/api/jobs?orderBy=<order> | GET | _order_: can be one of the following values: _asc_, _desc_ | {   "result": [        {            "id": <jobID>,            "creationDate": <creationDate>,"price": <jobPrice>,            "status": <jobStatus>        } ] }


## New Project

### Request

`POST /api/project/new`

    curl -i -X POST -H "Content-Type: application/json" \
    -d '{ "title": "New Project", "jobs": [{"price":"11"},{"price":"13"}] }' \
    http://localhost:3000/api/project/new

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 12
    ETag: W/"c-Zy7x97w4DHX4vQ3VkJrct4+MzdE"
    Date: Thu, 04 Nov 2021 07:51:09 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": 1
}
```

## New Job

### Request

`POST /api/job/new`

    curl -i -X POST -H "Content-Type: application/json" \
    -d '{ "projectId": "1", "job": {"price":"57"} }' \
    http://localhost:3000/api/job/new

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 12
    ETag: W/"c-2xfQEexmuBabtbKWDG7pROyCJpo"
    Date: Thu, 04 Nov 2021 07:51:29 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": 3
}
```
    
## Get Project by id

### Request

`GET /api/project/<id>`

    curl -i -H 'Accept: application/json' http://localhost:3000/api/project/1

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 320
    ETag: W/"140-Q1QiZvGRowtkIOzx+zugbTF863k"
    Date: Thu, 04 Nov 2021 07:52:29 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": {
        "id": 1,
        "title": "New Project",
        "jobs": [
            {
                "id": 1,
                "creationDate": "2021-11-04T07:51:09.000Z",
                "price": "11",
                "status": "in preparation"
            },
            {
                "id": 2,
                "creationDate": "2021-11-04T07:51:09.000Z",
                "price": "13",
                "status": "in preparation"
            },
            {
                "id": 3,
                "creationDate": "2021-11-04T07:51:29.000Z",
                "price": "57",
                "status": "in preparation"
            }
        ]
    }
}
```    

## Get all projects

### Request

`GET /api/projects`

    curl -i -H 'Accept: application/json' http://localhost:3000/api/projects

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 331
    ETag: W/"14b-RmpNOS5VS2/9F63KcGh8gwm10Ng"
    Date: Thu, 04 Nov 2021 09:19:51 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": [
        {
            "projectId": "1",
            "title": "New Project",
            "jobs": [
                {
                    "id": 1,
                    "creationDate": "2021-11-04T07:51:09.000Z",
                    "price": "11",
                    "status": "in preparation"
                },
                {
                    "id": 2,
                    "creationDate": "2021-11-04T07:51:09.000Z",
                    "price": "13",
                    "status": "in preparation"
                },
                {
                    "id": 3,
                    "creationDate": "2021-11-04T07:51:29.000Z",
                    "price": "57",
                    "status": "in preparation"
                }
            ]
        }
    ]
}
```
    
## Get All Jobs

### Request

`GET /api/jobs`

    curl -i -H 'Accept: application/json' http://localhost:3000/api/jobs

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 282
    ETag: W/"11a-wOk7rjIWRFPySjsNB650ByopVgs"
    Date: Thu, 04 Nov 2021 09:20:34 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": [
        {
            "id": 1,
            "creationDate": "2021-11-04T07:51:09.000Z",
            "price": "11",
            "status": "in preparation"
        },
        {
            "id": 2,
            "creationDate": "2021-11-04T07:51:09.000Z",
            "price": "13",
            "status": "in preparation"
        },
        {
            "id": 3,
            "creationDate": "2021-11-04T07:51:29.000Z",
            "price": "57",
            "status": "in preparation"
        }
    ]
}
```
    
## Change job status

### Request

`PUT /api/job/<id>`

    curl -i -X PUT -H "Content-Type: application/json" \
    -d '{ "status": "delivered" }' \
    http://localhost:3000/api/job/1

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 13
    ETag: W/"d-77fOzx3GQprOTFag13JV88hJJnY"
    Date: Thu, 04 Nov 2021 09:22:04 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": ""
}
```
    
## Get all jobs by status

### Request

`GET /api/jobs?status=<status>` where <status> can be one of the following values: _in preparation_, _in progress_, _cancelled_, _delivered_

    curl -i -H 'Accept: application/json' http://localhost:3000/api/jobs?status=in+preparation

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 202
    ETag: W/"ca-OoxlpLl1QVr3cihB6HlTmJMSpMU"
    Date: Thu, 04 Nov 2021 09:28:30 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
{
    "result": [
        {
            "id": 2,
            "creationDate": "2021-11-04T07:51:09.000Z",
            "price": "13",
            "description": "in preparation"
        },
        {
            "id": 3,
            "creationDate": "2021-11-04T07:51:29.000Z",
            "price": "57",
            "description": "in preparation"
        }
    ]
}
```    
## Get all jobs ordered by creation date

### Request

`GET /api/jobs?orderBy=<order>` where <order> can be on of the following values: _asc_, _desc_

    curl -i -H 'Accept: application/json' http://localhost:3000/api/jobs\?orderBy=asc

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 277
    ETag: W/"115-gO5B+rs9aHSFGFm3eEx6n+Sj0fA"
    Date: Thu, 04 Nov 2021 10:54:59 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
```json
    {
    "result": [
        {
            "id": 1,
            "creationDate": "2021-11-04T07:51:09.000Z",
            "price": "11",
            "status": "delivered"
        },
        {
            "id": 2,
            "creationDate": "2021-11-04T07:51:09.000Z",
            "price": "13",
            "status": "in preparation"
        },
        {
            "id": 3,
            "creationDate": "2021-11-04T07:51:29.000Z",
            "price": "57",
            "status": "in preparation"
        }
    ]
}
```
        
## Docker

Api Demo is very easy to install and deploy in a Docker container.
Every time a new container is deployed the database is fully initialized from scratch with the file [_install_db.sql_](https://github.com/michele-paparella/api-demo/blob/main/database/install_db.sql) available into the _database_ folder.
By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd api-demo
docker build -t <youruser>/api-demo:${package.json.version} .
docker network create node-api-demo-network
```

This will create the api-demo image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of api-demo.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run \
        --rm \
        -d \
        --name mysql_server \
        -e MYSQL_DATABASE='api-demo' \
        -e MYSQL_ROOT_PASSWORD='password' \
        --network node-api-demo-network \
        mysql:8.0
docker run \
		--rm \
		--name api-demo \
		--network node-api-demo-network \
		-p 3000:3000 \
		-v $(pwd):/app \
		<youruser>/api-demo
docker-compose up
```

> Note: change `api-demo` is the schema and `password` is the password of the MySQL admin account

Verify the deployment by calling one of the available APIs like /api/project/new (new project creation) .

```sh
curl -i -X POST -H "Content-Type: application/json" \
    -d '{ "title": "New Project", "jobs": [{"price":"11"},{"price":"13"}] }' \
    http://localhost:3000/api/project/new
```

Feel free to submit any feedback on this project! :)

## License

MIT


