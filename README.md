# Strapi plugin form-builder

A form builder plugin

## Setup plugin for the first time
1. Close the strapi app 
```docker compose down```

2. Disable form-builder plugin in `api/config/plugins.ts`

    ```
    ...
    /* 'form-builder': {
      enabled: true,
      resolve: './src/plugins/form-builder'
    }, */
    ...
    ```
    
3. Start up the app with the plugin disabled

    `docker compose up strapi`
    
4. In a new terminal, log in to docker container

    `docker exec -it {container_id} /bin/sh`
    
    Replace `container_id` with container id or name of `strapi` container found by executing command `docker ps`
    
    e.g.     `docker exec -it strapi-plugin-forms_strapi_1 /bin/sh`

    4.1 Go to plugin root directory in the container

        `cd src/plugins/form-builder/`
        
    4.2 Run 

        `yarn install`
        
    4.3 Run 

        `yarn build`
        
    4.4 Log out of docker container

        `exit`
        
5. Enable form-builder plugin in `api/config/plugins.ts` by uncommenting the commented code in step 2

6. Restart strapi app

    `docker compose up strapi`


### Commands to run for custom plugin local development

1. After starting up strapi container, in a new terminal tab, login to the container

2. Run the command to watch server files development

    `yarn develop-form` (in the docker container)
    `docker-compose run --rm strapi yarn develop-form` (in the project root)
    
3. Run the command to compile server files changes. (After starting up app, if new server file changes were made.)

    `yarn build-form` (in the docker container)
    `docker-compose run --rm strapi yarn build-form` (in the project root)

##### In case of errors in plugin, disable errors & build plugin
