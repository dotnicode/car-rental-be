1. Authentication
   1.1. As a client, I want to be able to sign up, recover my password and logout from my account.
   1.2. As a client, I want an user account so that I can request rentals.

2. Car Rental Flow
   2.1. As a client, I want to see a catalogue of the available cars so I can choose one to rent.
   2.2. As a client, I want to see the details of a particular car so I can rent it.
   2.3. As a client, I want to be able to request to rent a car for a span of time.
   2.4. As a client I want to see the historical list of my rental requests.

3. Core Development Setup
   3.1. As a developer, I need to set up the user module for the clients.
   3.2. As a developer, I need to set up the car module for clients and admins.
   3.3. As a developer, I need to set up the rent module for clients and admins.
   3.4. As a developer, I need to set up the picture module for the cars.

4. User Management
   4.1. As a client I want to update my user details so that I can update my description, name, age, etc.
   4.2. As a developer, I need to set up user roles -admin, user- in order to provide two separate user interfaces.
   4.3. As a developer, I want that non admin users are redirected from admin pages so I can securely work on my application.
   4.4. As an admin, I want to add new cars, set up their price, and load the images so that I can include them in the car gallery.
   4.5. As an admin I want to see the historical list of the user's requests so that I can give a truthful assessment of the user.

5. File Management
   5.1. As a developer, I want to set up a S3 bucket so that users can upload files into my application.
   5.2. As an admin I want to be able to upload pictures of the cars, so that I can provide visual information of the car.
   5.3. As a user I want to be able to upload my documents to the application so that admins can verify my identity.

6. Car Management
   6.1. As an admin I want to be able to edit the details of a car.
   6.2. As an admin, I want to manage the pictures related to a car.

7. Rental Management
   7.1. As an admin, I want to see a list of requested rents so that I can order them by priorities.
   7.2. As an admin, I want to be able to admit or deny a rent according to provided documents.

8. Payment System
   8.1. As the client, when receiving crypto payments, i want to always receive USDC
   8.2. As a user, before payment, I want the application to perform a conversion check to see if I have enough funds in my balance
   8.3. As a dev, I want to connect my wallet to the application using the Stellar SDK
