;(function (root, factory, name) {
    'use strict';
    root[name] = factory();
    if (typeof define === 'function' && define.amd) {
      define(function() { return root[name]; });
    } else if (typeof exports === 'object') {
      module.exports = root[name];
    }
  })((typeof window === 'object' && window) || this, function () {
    'use strict';
    var AntiSpamMail, antiSpamMail;
    AntiSpamMail = function() {};
    AntiSpamMail.fn = AntiSpamMail.prototype = {
      _version: '0.1.5',
      encryptFn: 'antiSpamMail.linkDecrypt',
      /**
       * Encrypt or decrypt a string
       *
       * @method encryptDecrypt
       * @param {String} originalString      string to encrypt or decrypt
       * @param {Number} [nFromCharCode=-1]  encrypt if +1, decrypt if -1
       * @returns {String} encrypted or decrypted string
       */
      encryptDecrypt: function(originalString, nFromCharCode) {
        var i, n, newString;
        if (nFromCharCode == null) {
          nFromCharCode = -1;
        }
        i = 0;
        n = 0;
        newString = '';
        while (i < originalString.length) {
          n = originalString.charCodeAt(i);
          if (n >= 8364) {
            n = 128;
          }
          newString += String.fromCharCode(n + nFromCharCode);
          i++;
        }
        return newString;
      }
    };
    antiSpamMail = new AntiSpamMail();
    /**
     * Crypt given mail
     *
     * @method encrypt
     * @param {String} emailToEncrypt  email address to encrypt
     * @returns {String} encrypted email address
     */
    antiSpamMail.encrypt = function(emailToEncrypt) {
      return this.encryptDecrypt('mailto:' + emailToEncrypt, 1);
    };
    /**
     * Initiate the form to encrypt
     *
     * @method encryptForm
     * @param {String} formName    the name of the form
     * @param {String} fieldName   name of email field
     * @returns void
     */
    antiSpamMail.encryptForm = function(formName, fieldName) {
      var cryptform, email, emailHtml, encryptedMail, fieldShowEncryptedHtml, fieldShowEncryptedMail, i, radioObj, radioValue;
      formName = formName || 'antiSpamMail';
      fieldName = fieldName || 'cryptmail_email';
      fieldShowEncryptedMail = 'cryptmail_cryptedmail';
      fieldShowEncryptedHtml = 'cryptmail_html';
      cryptform = document.forms[formName];
      email = cryptform[fieldName].value;
      if (cryptform.cryptmail_email.value.length < 4) {
        return false;
      }
      radioObj = cryptform.cryptmail_radio;
      if (radioObj.length > 0) {
        i = 0;
        while (i < radioObj.length) {
          radioValue = parseInt(radioObj[i].checked ? radioObj[i].value : void 0, 10);
          i++;
        }
      } else {
        radioValue = 0;
      }
      if (radioValue === 1) {
        emailHtml = email.replace(/\./g, '<span class="crypt" aria-hidden="true">.</span>.<span class="crypt" aria-hidden="true">.</span>');
        emailHtml = emailHtml.replace(/@/, '<span class="crypt" aria-hidden="true">.</span>@<span class="crypt" aria-hidden="true">.</span>');
      } else {
        emailHtml = email.replace(/\./g, ' [dot] ');
        emailHtml = emailHtml.replace(/@/, ' [at] ');
      }
      encryptedMail = this.encrypt(email);
      cryptform[fieldShowEncryptedMail].value = encryptedMail;
      cryptform[fieldShowEncryptedHtml].value = '<a href="javascript:' + this.encryptFn + '(\'' + encryptedMail + '\');">' + emailHtml + '</a>';
    };
    /**
     * Uncrypt the email address and returns the valid href
     *
     * @method decrypt
     * @param {String} encryptedMail   the crypted string
     * @returns {String} valid href
     */
    antiSpamMail.decrypt = function(encryptedMail) {
      return this.encryptDecrypt(encryptedMail);
    };
    /**
     * Public function for A tags
     *
     * @method linkDecrypt
     * @param {String} encryptedMail   the crypted string
     * @returns void
     */
    antiSpamMail.linkDecrypt = function(encryptedMail) {
      location.href = this.decrypt(encryptedMail);
    };
    return antiSpamMail;
  }, 'antiSpamMail');