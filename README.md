<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="./assets/logo.png" width="300px" />
</h1>

<h3 align="center">
  Challenge 3: FastFeet (2/4)</h3>

## :rocket: About the Challenge

FastFeet 2.0 is a delivery service application that builds on the previously developed [FastFeet](https://github.com/yagosansz/rockseat-bootcamp2020-challenge02).

## **Tools**

This app features all the latest tools and practices in backend development!

- [Express](https://expressjs.com/)
- [Sucrase](https://www.npmjs.com/package/sucrase) + [Nodemon](https://nodemon.io/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + [EditorConfig](https://github.com/editorconfig/editorconfig-vscode)
- [Docker](https://docs.docker.com/toolbox/toolbox_install_windows/) for Windows
- [Sequelize](https://sequelize.org/) - using PostgreSQL, but MySQL could also have been used
- [mongoose](https://mongoosejs.com/)
- Redis + [Bee-Queue](https://github.com/bee-queue/bee-queue) for managing queues and background jobs
- [jwt](https://www.npmjs.com/package/jsonwebtoken) for authentication
- [Yup](https://github.com/jquense/yup) for schema (input data) validation
- [Multer](https://www.npmjs.com/package/multer) for file uploads
- [date-fns](https://date-fns.org/) for manipulating dates
- [Mailtrap](https://mailtrap.io/) for testing fake email
- [Handlebars](https://handlebarsjs.com/) for generating HTML templates
- [Sentry](https://sentry.io/welcome/) for reporting errors
- [Youch](https://github.com/poppinss/youch) for prettifying error reporting
- [dotenv](https://www.npmjs.com/package/dotenv) for storing environment variables

## **Functionalities**

Bellow are the functionalities that were implemented for this application.

### **1. Managing Deliverymen - authenticated admins only**

It aims to allow admins to add deliverymen to the application.

A deliverymen needs to have the following fields:

  - id (deliveryman's id)
  - name (deliveryman's name)
  - avatar_id (deliveryman's picture)
  - email (deliveryman's email)
  - created_at
  - updated_at

| Resource         	| Method 	| Parameters    	| Header       	|
|------------------	|--------	|---------------	|--------------	|
| /deliverymen     	| GET    	|       -       	| Bearer Token 	|
| /deliverymen     	| POST   	| {name, email} 	| Bearer Token 	|
| /deliverymen/:id 	| PUT    	| {name, email} 	| Bearer Token 	|
| /deliverymen/:id 	| DELETE 	|       -       	| Bearer Token 	|

### **2. Managing Orders - authenticated admins only**

After a deliveryman is registered in the application the admin user has to assign orders to the deliverymen.

The Order needs to have the following fields:

  - id (order's id)
  - recipient_id (recipient's foreign key)
  - deliveryman_id (deliveryman's foreign key)
  - signature_id (recipient's signature, which will be an image)
  - product (product to be delivered)
  - canceled_at (cancellation date, if cancelled)
  - start_date (pick up date)
  - end_date (delivery date)
  - created_at
  - updated_at

  1) start_date must be added at the same moment the product is picked up for delivery, and the product can only be picked up between 08:00h and 18:00h.<br />
  2) end_date must be added when the delivery is successfully completed. <br />
  3) The deliverymen must receive an email when a order is assigned to him.<br />

| Resource    	| Method 	| Parameters                              	| Header       	|
|-------------	|--------	|-----------------------------------------	|--------------	|
| /orders     	| GET    	|                    -                    	| Bearer Token 	|
| /orders     	| POST   	| {recipient_id, deliveryman_id, product} 	| Bearer Token 	|
| /orders/:id 	| PUT    	| {recipient_id, deliveryman_id, product} 	| Bearer Token 	|
| /orders/:id 	| DELETE 	|                    -                    	| Bearer Token 	|


### **3. Displaying Deliveries - deliverymen**
Deliverymen must be able to display the orders that were assigned to them by informing only their respective id.

Therefore, they should be able to visualize:
1) orders that were not delivered or cancelled

| Resource                       	| Method 	| Parameters                              	| Header       	|
|--------------------------------	|--------	|-----------------------------------------	|--------------	|
| /deliveryman/:id/not-delivered 	| GET    	|                    -                    	|       -      	|

2) orders that have already been delivered by him/her

| Resource                    	| Method 	| Parameters                              	| Header       	|
|-----------------------------	|--------	|-----------------------------------------	|--------------	|
| /deliveryman/:id/deliveries 	| GET    	|                    -                    	|       -      	|

### **4. Changing Delivery Status - deliverymen**
Deliverymen should be able to add a pick up date (start_date) and a delivery date (end_date) for their deliveries. They cannot pick up more than 5 orders per day.

| Resource                                              	| Method 	| Parameters                              	| Header       	|
|-------------------------------------------------------	|--------	|-----------------------------------------	|--------------	|
| /deliveryman/:deliveryman_id/start-delivery/:order_id 	| PUT    	|               {start_date}              	|       -      	|

Furthermore, when completing a delivery, deliverymen shoud be able to register an image, which will be the signature_id in the orders table.
  * Image will be sent as 'file' in multipart/form-data

| Resource                                            	| Method 	| Parameters 	| Header       	|
|-----------------------------------------------------	|--------	|------------	|--------------	|
| /deliveryman/end-delivery?deliveryman_id=&order_id= 	| PUT    	|      -     	|       - 	    |

### **5. Register Problem(s) with a Delivery - authenticate admins only**

Deliverymen will not always be able to successfully deliver an order, due to a number of different reasons.

The delivery_problems table needs to have the following fields:

- delivery_id (order's id foreign key)
- description (description about the problem the deliveryman had)
- created_at
- updated_at

1) Route that will list all deliveries that have a problem

| Resource               	| Method      	| Parameters    	| Header       	|
|------------------------	|-------------	|---------------	|--------------	|
| /delivery-problems     	| GET (index) 	|       -       	| Bearer Token 	|

2) Route that will list all the problems a delivery has based on its id (order_id)

| Resource               	| Method      	| Parameters    	| Header       	|
|------------------------	|-------------	|---------------	|--------------	|
| /delivery/:id/problems 	| GET (show)  	|       -       	| Bearer Token 	|

3) Route that will allow a deliveryman - _no need for admin auth_ - to register problems with a delivery by entering the
order_id

| Resource               	| Method      	| Parameters    	| Header       	|
|------------------------	|-------------	|---------------	|--------------	|
| /delivery/:id/problems 	| POST        	| {description} 	|       -    	  |

4) Route that the delivery services company will use to cancel a delivery by using the delivery_problem id, from the delivery_problems table.

  * _canceled_at date will be the date the delivery is cancelled_

| Resource                        	| Method      	| Parameters    	| Header       	|
|---------------------------------	|-------------	|---------------	|--------------	|
| /delivery/:id/delivery-problems 	| PUT         	|       -       	| Bearer Token 	|

## Getting started

1. Clone this repo using `git clone https://github.com/yagosansz/rockseat-bootcamp2020-challenge03.git`
2. Move yourself to the appropriate directory: `cd rockseat-bootcamp2020-challenge03`<br />
3. Run `yarn` to install dependencies<br />

### **Getting started with the backend server**

1. Run `yarn sequelize db:migrate` to create tables
2. Run `yarn sequelize db:seed:all` to add seed data to the database
3. Run `yarn dev` to start the development server
4. Run `yarn queue` to start processing queues for background jobs
5. Test routes by either using [Insomnia](https://insomnia.rest/) or [Postman](https://www.getpostman.com/)

  ---

Made with :heart: by Yago!
