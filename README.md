# Open Update Profile Lambda

This AWS Lambda function is built to handle user profile updates, ensuring that each user’s name, email, and address are
kept up to date while enforcing unique email constraints across the user base. Here’s a breakdown of its functionality
and why it stands out:

## Key Highlights

- **Real-Time Profile Updates**:
  Users can update their profile details (name, email, and address) with ease. The function processes the data securely
  and efficiently, ensuring that user information is always current in DynamoDB.

- **Unique Email Enforcement**:
  Before making updates, the function performs a DynamoDB scan to check if the new email is already in use by another
  account. This validation ensures that no two users can have the same email address, maintaining integrity across the
  system.

- **Effortless Error Handling**:
  The function checks for missing fields (name, email, and address) and returns clear, user-friendly messages if any
  required information is missing, improving the user experience and reducing frustration.

## How It Works

- **Email Duplication Check**:
  Before updating any profile, the function queries DynamoDB with a ScanCommand to search for existing users with the
  same
  email but a different user ID. If a duplicate email is found, it stops the update process and informs the user that
  the
  email is already in use.

- **Profile Data Update**:
  Once the email is confirmed to be unique, the function updates the user’s profile with a new name, email, and address
  using the UpdateItemCommand. The updated profile is stored in DynamoDB, and all attributes (including an imageUrl, if
  available) are returned in the response.

## Why This Lambda is Awesome

This Lambda function takes care of real-time profile updates, ensuring data integrity through a simple yet effective
email uniqueness check. It combines powerful functionality with serverless scalability, making it perfect for any app
where user profiles are a key feature. By handling validation and updates in one seamless flow, the function enhances
both the user experience and the backend efficiency, making sure every update is smooth, secure, and reliable.













