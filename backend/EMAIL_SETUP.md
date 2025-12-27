# Email Configuration for JobGate

## Gmail Setup for Nodemailer

To enable email notifications, you need to configure Gmail with an App Password:

### Steps:

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com/

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to Security > 2-Step Verification
   - Follow the prompts to enable it

3. **Generate App Password**
   - Go to Security > App passwords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" - enter "JobGate"
   - Click "Generate"
   - Copy the 16-character password

4. **Add to .env file**
   - Open `backend/.env`
   - Add these lines:
   ```
   EMAIL_USER=abdelrhmanelanani202@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

5. **Restart the backend server**
   ```bash
   cd backend
   npm run dev
   ```

## Testing

Once configured, emails will be sent when:
- Admin clicks "Notify" button for shortlisted/rejected applications
- Applicants will receive emails at their registered email address

## Troubleshooting

If emails aren't sending:
1. Check that 2-Step Verification is enabled
2. Verify the App Password is correct (no spaces)
3. Check backend console for error messages
4. Ensure EMAIL_USER and EMAIL_PASSWORD are in .env file
