export function getAuthErrorMessage(message: string) {
  const normalizedMessage = message.trim().toLowerCase()

  if (normalizedMessage.includes("configuracion de seguridad incompleta")) {
    return "La autenticacion no esta disponible temporalmente por una configuracion de seguridad pendiente. Intenta de nuevo en unos minutos."
  }

  if (normalizedMessage.includes("captcha")) {
    return "La verificacion de seguridad fallo o expiro. Intenta completar el CAPTCHA otra vez."
  }

  if (
    normalizedMessage.includes("for security purposes") ||
    normalizedMessage.includes("you can only request this after")
  ) {
    return "Por seguridad, debes esperar unos segundos antes de volver a solicitar otro email."
  }

  if (normalizedMessage.includes("email rate limit exceeded")) {
    return "Supabase bloqueo temporalmente el envio de emails por demasiados intentos. Espera unos minutos o prueba iniciar sesion si la cuenta ya fue creada."
  }

  if (normalizedMessage.includes("demasiados intentos") || normalizedMessage.includes("too many requests")) {
    return "Demasiados intentos. Espera unos minutos antes de volver a intentar."
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Tu email todavia no fue confirmado. Revisa tu bandeja y abre el enlace de confirmacion antes de iniciar sesion."
  }

  if (normalizedMessage.includes("user already registered")) {
    return "Ese email ya esta registrado. Prueba iniciar sesion o recuperar el acceso."
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos."
  }

  if (normalizedMessage.includes("different from the old password")) {
    return "La nueva contraseña tiene que ser distinta de la anterior."
  }

  if (
    normalizedMessage.includes("password should be at least") ||
    normalizedMessage.includes("password is too short")
  ) {
    return "La contraseña es demasiado corta. Usá al menos 8 caracteres."
  }

  if (
    normalizedMessage.includes("weak") ||
    normalizedMessage.includes("easy to guess") ||
    normalizedMessage.includes("known to be")
  ) {
    return "Esa contraseña es demasiado fácil de adivinar o ya apareció en filtraciones. Elegí una más segura."
  }

  if (
    normalizedMessage.includes("expired") ||
    normalizedMessage.includes("link is invalid") ||
    normalizedMessage.includes("token has expired or is invalid")
  ) {
    return "El enlace expiró o ya fue usado. Pedí uno nuevo desde 'Olvidé mi contraseña'."
  }

  if (normalizedMessage.includes("unable to validate email")) {
    return "El email ingresado no es valido."
  }

  if (normalizedMessage.includes("invalid email")) {
    return "El email ingresado no es valido."
  }

  if (normalizedMessage.includes("signup is disabled")) {
    return "El registro esta deshabilitado en Supabase para este proyecto."
  }

  return message
}
