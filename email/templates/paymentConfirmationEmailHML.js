const paymentConfirmationEmailHTML = (a, b, c) => {
  console.log("ciao");
  return `<html>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="format-detection" content="telephone=no">

  <!-- disable auto telephone linking in iOS -->
  <style type="text/css">
    /* ========== Custom Font Import ========== */
    @import url(//daks2k3a4ib2z.cloudfront.net/0globals/avenirnextpro-webfont.css);
    /* RESET STYLES */
    body,
    #bodyTable,
    #bodyCell,
    #bodyCell {
      margin: 0;
      padding: 0;
      width: 100% !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Oxygen Sans', Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
    }
    table {
      /*border-collapse:collapse;*/
      border-spacing: 0px;
    }
    table[id=bodyTable] {
      width: 100% !important;
      margin: auto;
      max-width: 600px !important;
      color: #4A4A4A;
      font-weight: normal;
    }
    img,
    a img {
      border: 0;
      border-style: none;
      border-color: #ffffff;
      outline: none;
      text-decoration: none;
      height: auto;
      line-height: 100%;
    }
    a {
      text-decoration: none !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Oxygen Sans', Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #4A4A4A;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Oxygen Sans', Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      font-size: 20px;
      line-height: 125%;
      text-align: Left;
      letter-spacing: normal;
      margin-top: 17px;
      margin-right: 0;
      margin-bottom: 13px;
      margin-left: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
    }
    /* CLIENT-SPECIFIC STYLES */
    .ReadMsgBody {
      width: 100%;
    }
    .ExternalClass {
      width: 100%;
    }
    /* Force Hotmail/Outlook.com to display emails at full width. */
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }
    /* Force Hotmail/Outlook.com to display line heights normally. */
    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    /* Remove spacing between tables in Outlook 2007 and up. */
    #outlook a {
      padding: 0;
    }
    /* Force Outlook 2007 and up to provide a "view in browser" message. */
    img {
      -ms-interpolation-mode: bicubic;
      display: block;
      outline: none;
      text-decoration: none;
    }
    /* Force IE to smoothly render resized images. */
    body,
    table,
    td,
    p,
    a,
    li,
    blockquote {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      /*font-weight:normal!important;*/
    }
    /* Prevent Windows- and Webkit-based mobile platforms from changing declared text sizes. */
    .ExternalClass td[class="ecxflexibleContainerBox"] h3 {
      padding-top: 13px !important;
    }
    /* Force hotmail to push 2-grid sub headers down */
    /* /\/\/\/\/\/\/\/\/ TEMPLATE STYLES /\/\/\/\/\/\/\/\/ */
    /* ========== Page Styles ========== */
    h1 {
      display: block;
      font-size: 26px;
      font-style: normal;
      line-height: 100%;
    }
    h2 {
      display: block;
      font-size: 20px;
      font-style: normal;
      line-height: 120%;
    }
    h3 {
      display: block;
      font-size: 17px;
      font-style: normal;
      line-height: 110%;
    }
    h4 {
      display: block;
      font-size: 18px;
      font-style: italic;
      line-height: 100%;
    }
    .flexibleImage {
      height: auto;
    }
    .linkRemoveBorder {
      border-bottom: 0 !important;
    }
    table[class=flexibleContainerCellDivider] {
      padding-bottom: 0 !important;
      padding-top: 0 !important;
    }
    #emailBody {
      background-color: #FFFFFF;
      /*border-collapse:collapse;*/
      border-spacing: 0px;
      border: 1px solid #E0E1E2;
      padding: 16px;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px
    }
    .textRow {
      line-height: 32px;
    }
    .textContent,
    .textContentLast {
      color: #4A4A4A;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Oxygen Sans', Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      font-size: 16px;
      text-align: left;
    }
    .textContent.price {
      text-align: right;
      padding-left: 10px;
      width: 1%;
      white-space: nowrap;
    }
    .textContent.priceLabel {
      text-align: right;
    }
    .textContent.total {
      font-size: 25px;
      padding-top: 32px;
      text-align: right;
      font-weight: 600;
    }
    .productName {
      font-size: 20px;
      line-height: 24px;
      font-weight: 600;
      color: #4A4A4A;
    }
    .productPrice {
      text-align: right;
      color: #4A4A4A;
    }
    .productVariation {
      text-align: left;
      color: #4A4A4A;
    }
    .textContent a,
    .textContentLast a {
      color: #205478;
      text-decoration: underline;
    }
    .buttonContent {
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Oxygen Sans', Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      font-size: 18px;
      font-weight: bold;
      line-height: 100%;
      padding: 15px;
      text-align: center;
    }
    .buttonContent a {
      color: #FFFFFF;
      display: block;
      text-decoration: none !important;
      border: 0 !important;
    }
    .imageContentText {
      margin-top: 10px;
      line-height: 0;
    }
    .imageContentText a {
      line-height: 0;
    }
    #invisibleIntroduction {
      display: none !important;
      font-size: 1px
    }
    /* Removing the introduction text from the view */
    .ios-footer {
      color: #8D9196;
      text-decoration: none !important
    }
    .ios-footer a {
      color: #8D9196;
      text-decoration: none !important;
    }
    /*FRAMEWORK HACKS & OVERRIDES */
    span[class=ios-color-hack] a {
      color: #275100 !important;
      text-decoration: none !important;
    }
    /* Remove all link colors in IOS (below are duplicates based on the color preference) */
    span[class=ios-color-hack2] a {
      color: #205478 !important;
      text-decoration: none !important;
    }
    span[class=ios-color-hack3] a {
      color: #6B7075 !important;
      text-decoration: none !important;
    }
    */ .a[href^="tel"],
    a[href^="sms"] {
      text-decoration: none !important;
      color: #606060 !important;
      pointer-events: none !important;
      cursor: default !important;
    }
    .mobile_link a[href^="tel"],
    .mobile_link a[href^="sms"] {
      text-decoration: none !important;
      color: #606060 !important;
      pointer-events: auto !important;
      cursor: default !important;
    }
    /* Highlight edited text - for preview purpose only */
    .currentField {
      outline: 1px solid #6BB0FF;
      background: rgba(107, 176, 255, .35);
    }
    /* MOBILE STYLES */
    @media only screen and (max-width: 615px) {
      /*////// CLIENT-SPECIFIC STYLES //////*/
      body {
        width: 100% !important;
        min-width: 100% !important;
      }
      td[class="flexibleContainerBox"],
      td[class="flexibleContainerBox"] table {
        display: block;
        width: 100%;
        text-align: left;
      }
      td[class="imageContent"] img {
        height: auto !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      img[class="flexibleImage"] {
        height: auto !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      img[class="flexibleImageSmall"] {
        height: auto !important;
        width: auto !important;
      }
      table[class="flexibleContainerBoxNext"] {
        padding-top: 16px !important;
      }
      td[class="buttonContent"] {
        padding: 0 !important;
      }
      td[class="buttonContent"] a {
        padding: 15px !important;
      }
      /* FULL-WIDTH TABLES */
      table[class="responsive-table"] {
        width: 100% !important;
      }
      /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
      td[class="padding"] {
        padding: 10px 0px 10px 0px !important;
        text-align: center;
      }
      /* ADJUST BUTTONS ON MOBILE */
      td[class="mobile-wrapper"] {
        padding: 10px 5% 15px 5% !important;
      }
      table[class="mobile-button-container"] {
        margin: 0 auto;
        width: 100% !important;
        text-align: center;
      }
      a[class="mobile-button"] {
        width: 80% !important;
        /*padding: 15px !important;*/
        /*border: 0 !important;*/
        font-size: 16px !important;
        text-align: center;
      }
      #emailBody {
        padding: 0;
      }
    }
    /* specific breakpoint to prevent email view without paddings around email body*/
    /* 667px = (600px (width of content table) + 2 * 16px (padding on desktop) + 2px (borders)) * 100% / 95 % */
    @media only screen and (max-width: 667px) {
      /* Force iOS Mail to render the email at full width. */
      table[id="emailHeader"],
      table[id="emailBody"],
      table[id="emailFooter"] {
        width: 95% !important;
      }
      table[class="flexibleContainer"] {
        width: 100% !important;
      }
    }
    @media only screen and (-webkit-device-pixel-ratio:.75) {
      /* Put CSS for low density (ldpi) Android layouts in here */
    }
    @media only screen and (-webkit-device-pixel-ratio:1) {
      /* Put CSS for medium density (mdpi) Android layouts in here */
    }
    @media only screen and (-webkit-device-pixel-ratio:1.5) {
      /* Put CSS for high density (hdpi) Android layouts in here */
    }
    @media only screen and (min-device-width: 320px) and (max-device-width:568px) {}
    /* end IOS targeting */
  </style>
  <center bgcolor="#ffffff" style="background-color:#ffffff" id="mailContainer">
    <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;">
      <tbody>
        <tr>
          <td align="center" valign="top" id="bodyCell"> <!-- // EMAIL HEADER -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" id="emailHeader">

              <!-- HEADER ROW // -->
              <tbody>
                <tr>
                  <td align="center" valign="top">

                    <!-- CENTERING TABLE // -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" valign="top">

                            <!-- FLEXIBLE CONTAINER // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                              <tbody>
                                <tr>
                                  <td valign="top" width="600" class="flexibleContainerCell">

                                    <!-- CONTENT TABLE // -->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="middle" style="display:block; text-align:center;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%;">
                                              <tbody>
                                                <tr>
                                                  <td align="center" class="">
                                                    <img src="https://i.ibb.co/Wpg2m71D/tree-icon-transparent-320x320.png" width="499" style="height: auto; max-height: 150px; max-width: 150px; margin-top: 64px;" alt="Wildist" />

                                                    <!-- CONTENT // -->

                                                    <!-- Header and footer images have display inline block !important so they can be centered -->
                                                    <h1 style="max-width:400px;line-height:32px;font-size:25px;font-weight:400;margin-top: 32px;margin-bottom:32px;text-align:center;color: rgba(0,0,0,.7);" class="" id="greeting">Grazie per aver acquistato una piantina con "Ti Pianto Per Amore".</span></h1>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table> <!-- // FLEXIBLE CONTAINER -->
                          </td>
                        </tr>
                      </tbody>
                    </table> <!-- // CENTERING TABLE -->
                  </td>
                </tr> <!-- // END -->
              </tbody>
            </table> <!-- // END -->
            <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="600" id="emailBody" style="margin-bottom: 16px; border-radius: 5px; -webkit-border-radius: 5px; -moz-border-radius: 5px; font-size:1px;">
              <tbody>

                <!-- start -->

                <!-- end -->

                <!-- MODULE ROW // -->
                <tr>
                  <td align="left" valign="top">

                    <!-- CENTERING TABLE // -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" valign="top">

                            <!-- FLEXIBLE CONTAINER // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                              <tbody>
                                <tr>
                                  <td align="left" valign="top" width="600" class="flexibleContainerCell">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tbody>
                                        <tr>
                                          <td align="left" valign="top" style="padding: 0 16px">

                                            <!-- CONTENT TABLE // -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 16px;">
                                              <tbody>
                                                <tr valign="top" class="textContent" style="color: #4A4A4A;">
                                                  <td style="width: 120px">
                                                    <img src="https://i.ibb.co/Wpg2m71D/tree-icon-transparent-320x320.png" width="120" style="border-radius: 4px;width: 120px;" alt="Piantina &amp; Piantina" />
                                                  </td>
                                                  <td style="padding-left: 16px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td class="productName" style="padding-bottom: 4px;font-size:20px;line-height: 24px;font-weight: 600;color: #4A4A4A;" colspan="1">
                                                            Piantina &amp; Piantumazione
                                                          </td>
                                                          <td class="productPrice" style="text-align: right;color: #4A4A4A;font-size:16px">
                                                           €200
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td class="productVariation" style="text-align:left;color:#4A4A4A;font-size:16px;">
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table> <!-- // CONTENT TABLE -->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table> <!-- // FLEXIBLE CONTAINER -->
                          </td>
                        </tr>
                      </tbody>
                    </table> <!-- // CENTERING TABLE -->
                  </td>
                </tr> <!-- // MODULE ROW -->

                <!-- MODULE DIVIDER // -->
                <tr>
                  <td align="center" valign="top">

                    <!-- CENTERING TABLE // -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" valign="top">

                            <!-- FLEXIBLE CONTAINER // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" width="600" class="flexibleContainerCell">
                                    <table class="flexibleContainerCellDivider" border="0" cellpadding="16" cellspacing="0" width="100%">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="top" style="padding-top:0px;padding-bottom:0px;">

                                            <!-- CONTENT TABLE // -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="top" style="border-top:2px solid #F3F3F3;"></td>
                                                </tr>
                                              </tbody>
                                            </table> <!-- // CONTENT TABLE -->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table> <!-- // FLEXIBLE CONTAINER -->
                          </td>
                        </tr>
                      </tbody>
                    </table> <!-- // CENTERING TABLE -->
                  </td>
                </tr> <!-- // END -->

                <!-- MODULE ROW // -->
                <tr>
                  <td align="left" valign="top">

                    <!-- CENTERING TABLE // -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" valign="top">

                            <!-- FLEXIBLE CONTAINER // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                              <tbody>
                                <tr>
                                  <td align="left" valign="top" width="600" class="flexibleContainerCell">
                                    <table border="0" cellpadding="16" cellspacing="0" width="100%">
                                      <tbody>
                                        <tr>
                                          <td align="left" valign="top" style="padding-top: 16px;">

                                            <!-- CONTENT TABLE // -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                              <tbody>
                                                <tr>
                                                  <td valign="top">
                                                <tr>
                                                  <td valign="top" class="textContent" style="color: #4A4A4A;max-width: calc(100% - 150px); word-wrap: break-word;">
                                                    <div class="textRow" style="line-height: 32px;"><span style="font-weight: 600;font-size:16px;" class="" id="orderNumber">Numero ordine:</span>
                                                      <span style="font-size:16px;">&nbsp; ${b}</span>
                                                    </div>
                                                    <div class="textRow" style="line-height: 32px;"><span style="font-weight: 600;font-size:16px;" class="" id="orderDate">Data ordine:</span>
                                                      <span style="font-size:16px;">&nbsp; ${c}</span>
                                                    </div>
                                                  </td>
                                                  <td style="text-align:right; max-width: 150px; word-wrap: break-word;" valign="top" align="right">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                      <tbody>
                                                        <tr class="textRow" style="line-height: 32px; color:#4A4A4A;">
                                                          <td class="textContent priceLabel" style="max-width: 150px; word-wrap: break-word;"><span style="font-weight: 600;font-size:16px;text-align: right;" class="" id="subtotal">Subtotale</span>:</td>
                                                          <td class="textContent price">
                                                            <span style="font-size:16px;text-align: right;padding-left: 10px;width: 1%;white-space: nowrap;">€200 </span>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                <tr>
                                                  <td class="textContent total" colspan="2" style="color: #4A4A4A;font-size: 25px;padding-top: 32px;text-align: right;font-weight: 600;">
                                                    €200
                                                  </td>
                                                </tr>
                                          </td>
                                        </tr>
                                  </td>
                                </tr>
                              </tbody>
                            </table> <!-- // CONTENT TABLE -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table> <!-- // FLEXIBLE CONTAINER -->
          </td>
        </tr>
      </tbody>
    </table> <!-- // CENTERING TABLE -->
    </td>
    </tr> <!-- // MODULE ROW -->

    <!-- MODULE DIVIDER // -->
    <tr>
      <td align="center" valign="top">

        <!-- CENTERING TABLE // -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td align="center" valign="top">

                <!-- FLEXIBLE CONTAINER // -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                  <tbody>
                    <tr>
                      <td align="center" valign="top" width="600" class="flexibleContainerCell">
                        <table class="flexibleContainerCellDivider" border="0" cellpadding="16" cellspacing="0" width="100%">
                          <tbody>
                            <tr>
                              <td align="center" valign="top" style="padding-top:0px;padding-bottom:0px;">

                                <!-- CONTENT TABLE // -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="top" style="border-top:2px solid #F3F3F3;"></td>
                                    </tr>
                                  </tbody>
                                </table> <!-- // CONTENT TABLE -->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table> <!-- // FLEXIBLE CONTAINER -->
              </td>
            </tr>
          </tbody>
        </table> <!-- // CENTERING TABLE -->
      </td>
    </tr> <!-- // END -->

    

    <!-- MODULE DIVIDER // -->
    <tr>
      <td align="center" valign="top">

        <!-- CENTERING TABLE // -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td align="center" valign="top">

                <!-- FLEXIBLE CONTAINER // -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                  <tbody>
                    <tr>
                      <td align="center" valign="top" width="600" class="flexibleContainerCell">
                        <table class="flexibleContainerCellDivider" border="0" cellpadding="16" cellspacing="0" width="100%">
                          <tbody>
                            <tr>
                              <td align="center" valign="top" style="padding-top:0px;padding-bottom:0px;">

                                <!-- CONTENT TABLE // -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="top" style="border-top:2px solid #F3F3F3;"></td>
                                    </tr>
                                  </tbody>
                                </table> <!-- // CONTENT TABLE -->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table> <!-- // FLEXIBLE CONTAINER -->
              </td>
            </tr>
          </tbody>
        </table> <!-- // CENTERING TABLE -->
      </td>
    </tr> <!-- // END -->

    <!--QUI-->
    </tbody>
    </table>

    <!-- END WHITE CONTAINER SECTION -->
    </td>
    </tr>
    </tbody>
    </table>
  </center>
  <div itemscope="" itemtype="http://schema.org/EmailMessage">
    <div itemprop="publisher" itemscope="" itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Webflow">
      <link itemprop="url" href="https://webflow.com/">
      <link itemprop="url/googlePlus" href="https://plus.google.com/b/118282361738086985368">
    </div>
    <div itemprop="about" itemscope="" itemtype="http://schema.org/Offer">
      <link itemprop="image" href="https://d3e54v103j8qbb.cloudfront.net/gen/img/marketing/webflow-logo.svg">
    </div>
  </div>
 
 </html>`;
};
module.exports = paymentConfirmationEmailHTML;
// <!-- MODULE ROW // --> inseriesci in "QUI" se necessario
//     <tr>
//       <td align="left" valign="top">

//         <!-- CENTERING TABLE // -->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%">
//           <tbody>
//             <tr>
//               <td align="left" valign="top">

//                 <!-- FLEXIBLE CONTAINER // -->
//                 <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
//                   <tbody>
//                     <tr>
//                       <td align="left" valign="top" width="600" class="flexibleContainerCell">
//                         <table border="0" cellpadding="16" cellspacing="0" width="100%">
//                           <tbody>
//                             <tr>
//                               <td align="left" valign="top" style="padding-top:16px;">

//                                 <!-- CONTENT TABLE // -->
//                                 <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                                   <tbody>
//                                     <tr>
//                                       <td valign="top" class="textContent" style="color: #4A4A4A;">
//                                         <h3 style="line-height:24px;font-size:16px;font-weight:600;margin-top:0;margin-bottom:4px;text-align:left;"><span class="" id="billedTo">Billed To</span>:</h3>
//                                         <div style="text-align:left;font-size:16px;margin-bottom:0;margin-top:3px;line-height:24px;">
//                                           Smiles Davis
//                                           <br />
//                                           600 Montgomery St
//                                           <br />
//                                           San Franscisco, CA 94111
//                                           <br />
//                                           US
//                                           <br />
//                                           Visa ending in 6500
//                                           <br />
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table> <!-- // CONTENT TABLE -->
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table> <!-- // FLEXIBLE CONTAINER -->
//               </td>
//             </tr>
//           </tbody>
//         </table> <!-- // CENTERING TABLE -->
//       </td>
//     </tr> <!-- // MODULE ROW -->
