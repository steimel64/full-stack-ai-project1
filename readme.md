# Instructions 

## Backend 
CD into backend folder

Building the container 
```sh docker build  -t fastapi-docker ./```

Running the container 
```sh docker run -p 8000:8000 fastapi-docker```



## Front end
CD into front end folder

Building the container 
```sh docker build --no-cache -t nextjs-docker ./```


Running the container 
```sh docker run nextjs-docker```


## Docker Compose both containers 
Run the following command 
```docker-compose up```