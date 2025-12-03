const nodemailer = require('nodemailer');

/**
 * Email Service for Expérience Tech Platform
 * Handles all email sending functionality
 */

// Create reusable transporter
let transporter = null;

/**
 * Initialize email transporter
 */
function initTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER,
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('Email transporter verification failed:', error);
      } else {
        console.log('✅ Email transporter ready');
      }
    });
  }
  return transporter;
}

/**
 * Get email transporter (initialize if needed)
 */
function getTransporter() {
  if (!transporter) {
    return initTransporter();
  }
  return transporter;
}

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @param {Array} options.cc - CC recipients (optional)
 * @param {Array} options.bcc - BCC recipients (optional)
 * @param {Array} options.attachments - Attachments (optional)
 * @returns {Promise<Object>} - Email send result
 */
async function sendEmail(options) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured. Email not sent:', options.to);
      // Return mock success in development
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          messageId: 'mock-' + Date.now(),
          preview: `Email would be sent to ${options.to}`
        };
      }
      throw new Error('Email service not configured');
    }

    const emailTransporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Expérience Tech" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      ...(options.cc && { cc: options.cc }),
      ...(options.bcc && { bcc: options.bcc }),
      ...(options.attachments && { attachments: options.attachments })
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('✅ Email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @returns {Promise<Object>}
 */
async function sendWelcomeEmail(email, firstName) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenue chez Expérience Tech !</h1>
        </div>
        <div class="content">
          <p>Bonjour ${firstName},</p>
          <p>Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous avoir parmi nous !</p>
          <p>Vous pouvez maintenant :</p>
          <ul>
            <li>Accéder à notre catalogue de formations</li>
            <li>Découvrir nos services numériques</li>
            <li>Consulter nos produits et réalisations</li>
            <li>Interagir avec notre communauté</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Accéder à la plateforme</a>
          <p>Cordialement,<br>L'équipe Expérience Tech</p>
        </div>
        <div class="footer">
          <p>Expérience Tech - Votre partenaire numérique de confiance</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Bienvenue sur Expérience Tech',
    html
  });
}

/**
 * Send email verification email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} token - Verification token
 * @returns {Promise<Object>}
 */
async function sendVerificationEmail(email, firstName, token) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .code { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vérifiez votre email</h1>
        </div>
        <div class="content">
          <p>Bonjour ${firstName},</p>
          <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
          <a href="${verificationUrl}" class="button">Vérifier mon email</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <div class="code">${verificationUrl}</div>
          <p><strong>Ce lien expirera dans 24 heures.</strong></p>
          <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe Expérience Tech</p>
        </div>
        <div class="footer">
          <p>Expérience Tech - Votre partenaire numérique de confiance</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Vérifiez votre email - Expérience Tech',
    html
  });
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} token - Reset token
 * @returns {Promise<Object>}
 */
async function sendPasswordResetEmail(email, firstName, token) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .code { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <p>Bonjour ${firstName},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
          <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <div class="code">${resetUrl}</div>
          <div class="warning">
            <p><strong>Attention :</strong> Ce lien expirera dans 10 minutes. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          </div>
          <p>Cordialement,<br>L'équipe Expérience Tech</p>
        </div>
        <div class="footer">
          <p>Expérience Tech - Votre partenaire numérique de confiance</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Expérience Tech',
    html
  });
}

/**
 * Send order confirmation email
 * @param {string} email - Customer email
 * @param {string} firstName - Customer first name
 * @param {Object} order - Order details
 * @returns {Promise<Object>}
 */
async function sendOrderConfirmationEmail(email, firstName, order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Commande confirmée !</h1>
        </div>
        <div class="content">
          <p>Bonjour ${firstName},</p>
          <p>Votre commande a été confirmée avec succès.</p>
          <div class="order-details">
            <p><strong>Numéro de commande :</strong> ${order.reference || order._id}</p>
            <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Total :</strong> ${order.total} FCFA</p>
            <p><strong>Statut :</strong> ${order.status}</p>
          </div>
          <p>Vous pouvez suivre votre commande depuis votre espace client.</p>
          <p>Cordialement,<br>L'équipe Expérience Tech</p>
        </div>
        <div class="footer">
          <p>Expérience Tech - Votre partenaire numérique de confiance</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Commande confirmée - ${order.reference || order._id}`,
    html
  });
}

/**
 * Send quote request notification to admin
 * @param {string} serviceName - Service name
 * @param {Object} quoteData - Quote request data
 * @returns {Promise<Object>}
 */
async function sendQuoteRequestNotification(serviceName, quoteData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  if (!adminEmail) {
    console.warn('Admin email not configured');
    return { success: false, error: 'Admin email not configured' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .quote-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle demande de devis</h1>
        </div>
        <div class="content">
          <p>Une nouvelle demande de devis a été reçue pour le service <strong>${serviceName}</strong>.</p>
          <div class="quote-details">
            <p><strong>Nom :</strong> ${quoteData.name}</p>
            <p><strong>Email :</strong> ${quoteData.email}</p>
            ${quoteData.phone ? `<p><strong>Téléphone :</strong> ${quoteData.phone}</p>` : ''}
            ${quoteData.requirements ? `<p><strong>Exigences :</strong><br>${quoteData.requirements}</p>` : ''}
            ${quoteData.budget ? `<p><strong>Budget :</strong> ${quoteData.budget} FCFA</p>` : ''}
          </div>
          <p>Veuillez traiter cette demande depuis le dashboard administrateur.</p>
        </div>
        <div class="footer">
          <p>Expérience Tech - Système de notification</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Nouvelle demande de devis - ${serviceName}`,
    html
  });
}

// Initialize transporter on module load if credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  initTransporter();
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendQuoteRequestNotification,
  initTransporter,
  getTransporter
};

