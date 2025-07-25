const passwordResetEmailHTML = (a, b, c) => {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en" style="-moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased;">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title></title>
    <style type="text/css">
      @media only screen {
        html {
          min-height: 100%;
          background: #fff;
        }
      }
      @media only screen and (max-width:600px) {
        .small-float-center {
          margin: 0 auto !important;
          float: none !important;
          text-align: center !important;
        }
        .small-text-center {
          text-align: center !important;
        }
        .small-text-left {
          text-align: left !important;
        }
        .small-text-right {
          text-align: right !important;
        }
      }
      @media only screen and (max-width:600px) {
        .hide-for-large {
          display: block !important;
          width: auto !important;
          overflow: visible !important;
          max-height: none !important;
          font-size: inherit !important;
          line-height: inherit !important;
        }
      }
      @media only screen and (max-width:600px) {
        table.body table.container .hide-for-large,
        table.body table.container .row.hide-for-large {
          display: table !important;
          width: 100% !important;
        }
      }
      @media only screen and (max-width:600px) {
        table.body table.container .callout-inner.hide-for-large {
          display: table-cell !important;
          width: 100% !important;
        }
      }
      @media only screen and (max-width:600px) {
        table.body table.container .show-for-large {
          display: none !important;
          width: 0;
          mso-hide: all;
          overflow: hidden;
        }
      }
      a:hover {
        color: #99cc00;
      }
      a:active {
        color: #99cc00;
      }
      a:visited {
        color: #99cc00;
      }
      h1 a:visited {
        color: #99cc00;
      }
      h2 a:visited {
        color: #99cc00;
      }
      h3 a:visited {
        color: #99cc00;
      }
      h4 a:visited {
        color: #99cc00;
      }
      h5 a:visited {
        color: #99cc00;
      }
      h6 a:visited {
        color: #99cc00;
      }
      table.button table tr td a:visited {
        color: #fff;
      }
      table.button.large table tr td a:visited {
        color: #fff;
      }
      table.button.large:active table tr td a {
        color: #fff;
      }
      table.button.large:hover table tr td a {
        color: #fff;
      }
      table.button.small table tr td a:visited {
        color: #fff;
      }
      table.button.small:active table tr td a {
        color: #fff;
      }
      table.button.small:hover table tr td a {
        color: #fff;
      }
      table.button.tiny table tr td a:visited {
        color: #fff;
      }
      table.button.tiny:active table tr td a {
        color: #fff;
      }
      table.button.tiny:hover table tr td a {
        color: #fff;
      }
      table.button:active table tr td a {
        color: #fff;
      }
      table.button:hover table tr td a {
        color: #fff;
      }
      table.button:active table td {
        background: #99cc00;
        color: #fff;
      }
      table.button:hover table td {
        background: #99cc00;
        color: #fff;
      }
      table.button:visited table td {
        background: #99cc00;
        color: #fff;
      }
      table.button:active table a {
        border: 0 solid #99cc00;
      }
      table.button:hover table a {
        border: 0 solid #99cc00;
      }
      table.button:visited table a {
        border: 0 solid #99cc00;
      }
      table.button.secondary:hover table td {
        background: #e6f8ff;
        color: #fff;
      }
      table.button.secondary:hover table a {
        border: 0 solid #e6f8ff;
      }
      table.button.secondary:hover table td a {
        color: #fff;
      }
      table.button.secondary:active table td a {
        color: #fff;
      }
      table.button.secondary table td a:visited {
        color: #fff;
      }
      table.button.success:hover table td {
        background: #23bf5d;
      }
      table.button.success:hover table a {
        border: 0 solid #23bf5d;
      }
      table.button.alert:hover table td {
        background: #e23317;
      }
      table.button.alert:hover table a {
        border: 0 solid #e23317;
      }
      table.button.warning:hover table td {
        background: #cc8b00;
      }
      table.button.warning:hover table a {
        border: 0 solid #cc8b00;
      }
      .thumbnail:focus {
        box-shadow: 0 0 6px 1px rgba(0, 159, 217, .5);
      }
      .thumbnail:hover {
        box-shadow: 0 0 6px 1px rgba(0, 159, 217, .5);
      }
      @media only screen and (max-width:600px) {
        table.body img {
          width: auto;
          height: auto;
        }
        table.body center {
          min-width: 0 !important;
        }
        table.body .container {
          width: 95% !important;
        }
        table.body .column,
        table.body .columns {
          height: auto !important;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        table.body .column .column,
        table.body .column .columns,
        table.body .columns .column,
        table.body .columns .columns {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        table.body .collapse .column,
        table.body .collapse .columns {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        td.small-1,
        th.small-1 {
          display: inline-block !important;
          width: 8.33333% !important;
        }
        td.small-2,
        th.small-2 {
          display: inline-block !important;
          width: 16.66667% !important;
        }
        td.small-3,
        th.small-3 {
          display: inline-block !important;
          width: 25% !important;
        }
        td.small-4,
        th.small-4 {
          display: inline-block !important;
          width: 33.33333% !important;
        }
        td.small-5,
        th.small-5 {
          display: inline-block !important;
          width: 41.66667% !important;
        }
        td.small-6,
        th.small-6 {
          display: inline-block !important;
          width: 50% !important;
        }
        td.small-7,
        th.small-7 {
          display: inline-block !important;
          width: 58.33333% !important;
        }
        td.small-8,
        th.small-8 {
          display: inline-block !important;
          width: 66.66667% !important;
        }
        td.small-9,
        th.small-9 {
          display: inline-block !important;
          width: 75% !important;
        }
        td.small-10,
        th.small-10 {
          display: inline-block !important;
          width: 83.33333% !important;
        }
        td.small-11,
        th.small-11 {
          display: inline-block !important;
          width: 91.66667% !important;
        }
        td.small-12,
        th.small-12 {
          display: inline-block !important;
          width: 100% !important;
        }
        .column td.small-12,
        .column th.small-12,
        .columns td.small-12,
        .columns th.small-12 {
          display: block !important;
          width: 100% !important;
        }
        table.body td.small-offset-1,
        table.body th.small-offset-1 {
          margin-left: 8.33333% !important;
          Margin-left: 8.33333% !important;
        }
        table.body td.small-offset-2,
        table.body th.small-offset-2 {
          margin-left: 16.66667% !important;
          Margin-left: 16.66667% !important;
        }
        table.body td.small-offset-3,
        table.body th.small-offset-3 {
          margin-left: 25% !important;
          Margin-left: 25% !important;
        }
        table.body td.small-offset-4,
        table.body th.small-offset-4 {
          margin-left: 33.33333% !important;
          Margin-left: 33.33333% !important;
        }
        table.body td.small-offset-5,
        table.body th.small-offset-5 {
          margin-left: 41.66667% !important;
          Margin-left: 41.66667% !important;
        }
        table.body td.small-offset-6,
        table.body th.small-offset-6 {
          margin-left: 50% !important;
          Margin-left: 50% !important;
        }
        table.body td.small-offset-7,
        table.body th.small-offset-7 {
          margin-left: 58.33333% !important;
          Margin-left: 58.33333% !important;
        }
        table.body td.small-offset-8,
        table.body th.small-offset-8 {
          margin-left: 66.66667% !important;
          Margin-left: 66.66667% !important;
        }
        table.body td.small-offset-9,
        table.body th.small-offset-9 {
          margin-left: 75% !important;
          Margin-left: 75% !important;
        }
        table.body td.small-offset-10,
        table.body th.small-offset-10 {
          margin-left: 83.33333% !important;
          Margin-left: 83.33333% !important;
        }
        table.body td.small-offset-11,
        table.body th.small-offset-11 {
          margin-left: 91.66667% !important;
          Margin-left: 91.66667% !important;
        }
        table.body table.columns td.expander,
        table.body table.columns th.expander {
          display: none !important;
        }
        table.body .right-text-pad,
        table.body .text-pad-right {
          padding-left: 10px !important;
        }
        table.body .left-text-pad,
        table.body .text-pad-left {
          padding-right: 10px !important;
        }
        table.menu {
          width: 100% !important;
        }
        table.menu td,
        table.menu th {
          width: auto !important;
          display: inline-block !important;
        }
        table.menu.small-vertical td,
        table.menu.small-vertical th,
        table.menu.vertical td,
        table.menu.vertical th {
          display: block !important;
        }
        table.menu[align=center] {
          width: auto !important;
        }
        table.button.small-expand,
        table.button.small-expanded {
          width: 100% !important;
        }
        table.button.small-expand table,
        table.button.small-expanded table {
          width: 100%;
        }
        table.button.small-expand table a,
        table.button.small-expanded table a {
          text-align: center !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        table.button.small-expand center,
        table.button.small-expanded center {
          min-width: 0;
        }
      }
      @media only screen and (max-width:600px) {
        .small-12.large-6+.small-12.large-6 table.button {
          margin-top: 0 !important;
        }
      }
      table.button table td a:hover {
        background: #99cc00;
      }
      table.button table td a:visited {
        background: #99cc00;
      }
      table.button.secondary table td a:hover {
        color: #99cc00;
        background: #fff;
        border: 2px solid #d3d4d5;
      }
      table.button.secondary table td a:visited {
        color: #99cc00;
        background: #fff;
        border: 2px solid #d3d4d5;
      }
      table.button.welcome-button-black table td a:hover {
        color: #fff;
        background: #343434;
      }
      table.button.welcome-button-black table td a:visited {
        color: #fff;
        background: #343434;
      }
      table.button.welcome-button-secondary table td a:hover {
        color: #000;
        border: 1px solid #000;
        background: #fff;
      }
      table.button.welcome-button-secondary table td a:visited {
        color: #000;
        border: 1px solid #000;
        background: #fff;
      }
      table.button.tpe-narrow-padding table td a:hover {
        padding: 0;
      }
      table.button.tpe-narrow-padding table td a:visited {
        padding: 0;
      }
      table.button.tertiary table td a:hover {
        color: #676d73;
        background: #fff;
        border: 2px solid #d3d4d5;
      }
      table.button.tertiary table td a:visited {
        color: #676d73;
        background: #fff;
        border: 2px solid #d3d4d5;
      }
      @media only screen and (min-width:600px) {
        td.new-category-caption>table {
          height: 105px !important;
        }
      }
      @media only screen and (min-width:600px) {
        .app-upsell-medium__text {
          text-align: left !important;
          max-width: 250px !important;
          float: left !important;
        }
        .app-upsell-medium__img {
          width: 190px !important;
          float: right !important;
          clear: none !important;
        }
        .app-upsell-medium__container {
          max-width: 100% !important;
        }
      }
      @media only screen and (max-width:600px) {
        .confirmed-available-block {
          margin-top: 5px;
          border-radius: 500px;
          height: 20px;
          max-height: 20px;
          width: 157px;
          max-width: 157px;
          display: inline-block;
          line-height: 20px;
          text-align: center;
          padding-bottom: 2px;
        }
      }
      @media only screen and (max-width:600px) {
        .tpe-ir-welcome-headline--width-50 {
          width: 100% !important;
          padding-left: 0 !important;
        }
        .tpe-ir-welcome-headline--width-60 {
          width: 100% !important;
          padding-left: 0 !important;
        }
        .tpe-ir-welcome-paragraph--width-100-media {
          width: 100% !important;
          padding-left: 0 !important;
        }
      }
      @media only screen and (max-width:600px) {
        .ar-item__title {
          margin-bottom: 0;
        }
      }
      @media only screen and (min-width:600px) {
        .ar-item__price {
          float: right !important;
          text-align: right !important;
        }
      }
    </style>
  </head>
  <body style="-moz-box-sizing: border-box; -moz-osx-font-smoothing: grayscale; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; Margin: 0; box-sizing: border-box; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0; min-width: 100%; padding: 0; text-align: left; width: 100% !important;"><span class="preheader" style="color: #fff; display: none !important; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; mso-hide: all !important; opacity: 0; overflow: hidden; visibility: hidden;"></span>
    <table class="body" style="-moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased; Margin: 0; background: #fff; border-collapse: collapse; border-spacing: 0; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; height: 100%; line-height: 1.6; margin: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
      <tbody>
        <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
          <td class="center" align="left" valign="top" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">
            <center data-parsed="" style="min-width: 580px; width: 100%;">
              <table align="center" class="container tpe-background--transparent" style="Margin: 0 auto; background: 0 0; border-collapse: collapse; border-radius: 6px !important; border-spacing: 0; margin: 0 auto; padding: 0; text-align: inherit; vertical-align: top; width: 580px;">
                <tbody>
                  <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                    <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; padding-bottom: 0; padding-top: 16px; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top">
                      <center data-parsed="" style="min-width: 580px; width: 100%;">
                        <table align="center" class="menu float-center" style="Margin: 0 auto; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: auto !important;">
                          <tbody>
                            <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                              <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top">
                                <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top;">
                                  <tbody>
                                    <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                                      <th class="menu-item float-center" style="Margin: 0 auto; color: #676d73; float: none; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0 auto; padding: 10px; padding-right: 10px; text-align: center;" align="center"><a href="https://piantala-a.onrender.com" style="Margin: 0; color: #99cc00; font-family: Helvetica,Arial,sans-serif; font-weight: 400; line-height: 1.6; margin: 0; padding: 0; text-align: left; text-decoration: none;"><img src="https://i.ibb.co/Wpg2m71D/tree-icon-transparent-320x320.png" width="50" height="50" style="-ms-interpolation-mode: bicubic; border: none; clear: both; display: block; max-height: 150px; max-width: 150px; outline: 0; text-decoration: none; width: auto;" alt="Ti Pianto Per Amore" /></a></th>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </center>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" class="container float-center" style="Margin: 0 auto; background: 0 0; border-collapse: collapse; border-radius: 6px !important; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 580px;">
                <tbody>
                  <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                    <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; padding-bottom: 0; padding-top: 16px; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top">
                      <table class="row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                        <tbody>
                          <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                            <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0 auto; padding: 0; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; text-align: left; width: 560px;" align="left">
                              <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                <tbody>
                                  <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                                    <th style="Margin: 0; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0; padding: 0; text-align: left;" align="left">
                                      <h1 style="Margin: 0; Margin-bottom: 12px; color: #2f3033; font-family: Helvetica,Arial,sans-serif; font-size: 24px; font-weight: 700; line-height: 32px; margin: 0; margin-bottom: 12px; padding: 0; text-align: left; word-wrap: normal;" align="left">Ciao ${b},</h1>
                                      <p style="Margin: 0; Margin-bottom: 16px; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0; margin-bottom: 16px; padding: 0; text-align: left;" align="left">Abbiamo ricevuto la richiesta di resettare la password del tuo account di Ti Pianto Per Amore. Per resettare la password, <a href="${c}" style="Margin: 0; color: #99cc00; font-family: Helvetica,Arial,sans-serif; font-weight: 400; line-height: 1.6; margin: 0; padding: 0; text-align: left; text-decoration: none;">scegli una nuova password adesso.</a> Questo link scadrà tra 24 ore.</p>
                                      <table class="button rounded small-expanded tpe-margin--none" style="Margin: 0 !important; border-collapse: collapse; border-spacing: 0; margin: 0 !important; margin-bottom: 12px; margin-top: 24px; padding: 0; text-align: left; vertical-align: top; width: auto;">
                                        <tbody>
                                          <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                                            <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top">
                                              <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                                <tbody>
                                                  <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                                                    <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; background: #99cc00; border: none; border-collapse: collapse !important; border-radius: 4px; color: #fff; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 1.6; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top"><a href="${c}" style="Margin: 0; background: #99cc00; border: 0 solid #99cc00; border-radius: 4px; color: #fff; display: inline-block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 700; line-height: 1.6; margin: 0; padding: 10px 24px 10px 24px; text-align: left; text-decoration: none;">Set new password</a></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                        <tbody>
                                          <tr style="padding: 0; text-align: left; vertical-align: top;" align="left">
                                            <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;" align="left" valign="top"> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p style="Margin: 0; Margin-bottom: 16px; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0; margin-bottom: 16px; padding: 0; text-align: left;" align="left">Se non hai richiesto di resettare la tua password ti inviatiamo a contattarci al seguente indirizzo mail <a href="mailto:tipiantoperamore@gmail.com" style="Margin: 0; color: #99cc00; font-family: Helvetica,Arial,sans-serif; font-weight: 400; line-height: 1.6; margin: 0; padding: 0; text-align: left; text-decoration: none;">tipiantoperamore@gmail</a>.</p>
                                    </th>
                                    <th class="expander" style="Margin: 0; color: #676d73; font-family: Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;" align="left"></th>
                                  </tr>
                                </tbody>
                              </table>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </center>
          </td>
        </tr>
      </tbody>
    </table>
<!-- prevent Gmail on iOS font size manipulation -->
    <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">                                                           </div>
   
    </body>
</html>
 `;
};

module.exports = passwordResetEmailHTML;
