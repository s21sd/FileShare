# File Sharing App

Welcome to the File Sharing App! This application allows users to securely share various types of files with just the recipient's email address. Users can upload and view files like videos, audios, texts, images, and PDFs. It features authentication functionalities for user registration, login, and logout. The app is built using Next.js, React, TypeScript, Lottie Animation, Express, and MongoDB Atlas.

## Features

- User Registration: Users can sign up for an account by providing their email and password.
- User Login: Registered users can log in to their accounts using their credentials.
- User Logout: Users can securely log out of their accounts.
- File Upload: Authenticated users can upload various types of files to the platform.
- File Viewing: Users can view files shared with them by entering the sender's email address.
- File Types Supported: The app supports sharing and viewing of videos, audios, texts, images, and PDFs.

## Technologies Used

- Next.js
- React
- TypeScript
- Lottie Animation
- Express
- MongoDB Atlas
- NodeMailer
- Material UI

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/file-sharing-app.git
```

2. Navigate to the project directory:

```bash
cd file-sharing-app
```

3. Install dependencies for both the client and server:

```bash
cd client
npm install
cd ../server
npm install
```

4. Set up environment variables:

   - Create a `.env` file in both the `client` and `server` directories.
   - Refer to `.env.example` files in each directory for the required environment variables.

5. Start the server:

```bash
cd ../server
npm start
```

6. Start the client:

```bash
cd ../client
npm start
```

7. Access the application in your browser at `http://localhost:3000`.

## Usage

1. Register for an account by providing your email and password.
2. Log in to your account.
3. Upload files by clicking on the upload button and selecting the desired files.
4. View files by entering the sender's email address.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
