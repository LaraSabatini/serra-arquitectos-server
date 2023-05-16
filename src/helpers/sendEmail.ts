import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars"
import nodemailer from "nodemailer"
import path from "path"
import config from "@config/index"

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "../..", "emails"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../..", "emails"),
}

const transportInfo = {
  host: config.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL,
    pass: config.MAIL_PASS,
  },
}

const sendEmail = (
  to: string[],
  subject: string,
  template: string,
  context: any,
  res: any,
) => {
  const transporter = nodemailer.createTransport(transportInfo)

  transporter.use("compile", hbs(handlebarOptions))

  const mailOptions = {
    from: '"Serra Arquitectos" <info@vonceescalada.com>',
    to,
    subject,
    template,
    context,
  }

  transporter.sendMail(mailOptions, (error: any) => {
    if (error) {
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        error,
      })
    }
    return res.status(201).json({
      message: "Email sent successfully",
      status: 201,
    })
  })
}

export default sendEmail
