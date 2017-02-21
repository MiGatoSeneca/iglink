Crear Certificado en SSL for Free

www.sslforfree.com

* Meter la URL
* Mirar si ha añadido una url de más (si no pones www te añade la www)
* Seleccionar Manual Verification (DNS)
* Meter el campo TXT en el DNS
* La clave del certificado es el campo TXT
* Dar a continurar y descargar los 3 certificados
* Hecho! (Si tienes Azure te quedan dos pasos)
* [Azure] ejecutar -> openssl pkcs12 -export -out certificate.pfx -inkey private.key -in certificate.crt
* [Azure] subir el certificado pfx

