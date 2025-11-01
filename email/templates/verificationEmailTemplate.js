const verificationEmailHTML = (a, url) => {
  return `<!doctype html>
<html>
  <head>
    <title>Please confirm your e-mail</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      table {
        border-collapse: collapse !important;
      }
      body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      a {
        color: #99cc00;
        text-decoration: underline;
      }
      * img[tabindex="0"] + div {
        display: none !important;
      }
      @media screen and (max-width: 350px) {
        h1 {
          font-size: 24px !important;
          line-height: 24px !important;
        }
      }
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
      @media screen and (min-width: 360px) {
        .headingMobile {
          font-size: 40px !important;
        }
        .headingMobileSmall {
          font-size: 28px !important;
        }
      }
    </style>
  </head>
  <body
    bgcolor="#ffffff"
    style="
      background-color: #ffffff;
      margin: 0 !important;
      padding: 0 !important;
    "
  >
    <div
      style="
        display: none;
        font-size: 1px;
        color: #fefefe;
        line-height: 1px;
        font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      "
    >
      - to finish signing up, you just need to confirm that we got your e-mail
      right within 48 hours. To confirm please click the VERIFY button.
    </div>
    <center>
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        align="center"
        valign="top"
      >
        <tbody>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                valign="top"
                bgcolor="#ffffff"
                style="padding: 0 20px !important; max-width: 500px; width: 90%"
              >
                <tbody>
                  <tr>
                    <td
                      bgcolor="#ffffff"
                      align="center"
                      style="padding: 10px 0 0px 0"
                    >
                      <!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="350">

                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
<tr>
<td align="center" valign="top" width="350">
<![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 20px 0 0 0;
                                color: #666666;
                                font-family:
                                  &quot;Helvetica Neue&quot;, Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                font-weight: 400;
                                -webkit-font-smoothing: antialiased;
                              "
                            >
                              <p
                                class="headingMobile"
                                style="
                                  margin: 0;
                                  color: #171717;
                                  font-size: 26px;
                                  font-weight: 200;
                                  line-height: 130%;
                                  margin-bottom: 5px;
                                "
                              >
                                Verifica il tuo indirizzo mail
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td height="20"></td>
                          </tr>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 0;
                                color: #666666;
                                font-family:
                                  &quot;Helvetica Neue&quot;, Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                font-weight: 400;
                                -webkit-font-smoothing: antialiased;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  color: #585858;
                                  font-size: 14px;
                                  font-weight: 400;
                                  line-height: 170%;
                                "
                              >
                                Grazie per aver avviato la registrazione a Ti Pianto Per Amore.
                              </p>
                              <p
                                style="
                                  margin: 0;
                                  margin-top: 20px;
                                  line-height: 0;
                                "
                              ></p>
                              <p
                                style="
                                  margin: 0;
                                  color: #585858;
                                  font-size: 14px;
                                  font-weight: 400;
                                  line-height: 170%;
                                "
                              >
                                Conferma che
                                <b>${a}</b> sia il tuo indirizzo mail cliccando sul tasto in basso o utilizzando questo link
                                <a
                                  style="
                                    color: #99cc00;
                                    text-decoration: underline;
                                  "
                                  target="_blank"
                                  href=${url}
                                  >${url}</a
                                >
                                entro le prossime 48&nbsp;ore.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 33px 0 33px 0"
                                  >
                                    <table
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          align="center"
                                          style="border-radius: 4px"
                                          bgcolor="#99cc00"
                                        >
                                          <a
                                            href=${url}
                                            style="
                                              text-transform: uppercase;
                                              background: #99cc00;
                                              font-size: 13px;
                                              font-weight: 700;
                                              font-family:
                                                Helvetica, Arial, sans-serif;
                                              color: #ffffff;
                                              text-decoration: none !important;
                                              padding: 20px 25px;
                                              border-radius: 4px;
                                              border: 1px solid #99cc00;
                                              display: block;
                                              -webkit-font-smoothing: antialiased;
                                            "
                                            target="_blank"
                                            ><span
                                              style="
                                                color: #ffffff;
                                                text-decoration: none;
                                              "
                                              >Verifica</span
                                            ></a
                                          >
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (gte mso 9)|(IE)]></td></tr></table>
<![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
<tr>
<td align="center" valign="top" width="350">
<![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width: 500px"
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="center"
                              style="
                                padding: 30px 0 30px 0;
                                color: #666666;
                                font-family:
                                  &quot;Helvetica Neue&quot;, Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                font-weight: 400;
                                line-height: 18px;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  color: #585858;
                                  font-size: 12px;
                                  font-weight: 400;
                                  -webkit-font-smoothing: antialiased;
                                  line-height: 170%;
                                "
                              >
                                Hai bisogno di assistenza? Contattaci all'indirizzo mail
                                <a
                                  href="mailto:tipiantoperamore@gmail.com"
                                  color: #99cc00;
                                  target="_blank"
                                  >tipiantoperamore@gmail.com</a
                                >
                              </p>
                              <tr>
                                <td
                                  bgcolor="#ffffff"
                                  align="center"
                                  style="
                                    padding: 0;
                                    color: #666666;
                                    font-family:
                                      &quot;Helvetica Neue&quot;, Helvetica,
                                      Arial, sans-serif;
                                    font-size: 16px;
                                    font-weight: 400;
                                    line-height: 18px;
                                  "
                                >
                                  <p
                                    style="
                                      margin: 0;
                                      color: #585858;
                                      font-size: 12px;
                                      font-weight: 400;
                                      -webkit-font-smoothing: antialiased;
                                      line-height: 170%;
                                    "
                                  ></p>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  bgcolor="#ffffff"
                                  align="center"
                                  style="
                                    padding: 15px 0 30px 0;
                                    color: #666666;
                                    font-family:
                                      &quot;Helvetica Neue&quot;, Helvetica,
                                      Arial, sans-serif;
                                    font-size: 16px;
                                    font-weight: 400;
                                    line-height: 18px;
                                  "
                                >
                                  <p
                                    style="
                                      margin: 0;
                                      color: #585858;
                                      font-size: 12px;
                                      font-weight: 400;
                                      -webkit-font-smoothing: antialiased;
                                      line-height: 170%;
                                    "
                                  >
                                    Associazione Culturale Amici di Ernest Verner.<br />
                                    Contrada Gravinella<br />
                                    Fasano, BR 72015, ITA
                                  </p>
                                </td>
                              </tr>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (gte mso 9)|(IE)]></td></tr></table>
<![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  </body>
</html>
`;
};

module.exports = verificationEmailHTML;
