/*
 * DNSSEC check script
 * 
 * Include this script in your HTML, and an empty <div> with id 
 * 'sidn_dnssec_check' somewhere on the page.
 * 
 * The script automatically runs, and tries to resolve a domain name
 * that should not validate. If that succeeds it will hide the
 * 'checking' image, and shows 'sidn_dnssec_insecure'. If it does
 * not succeed, it will show the 'sidn_dnssec_secure' image.
 * 
 * Images, or replacement texts, can be changed in the calling
 * code. See example.html for an example.
 * 
 * By default, it uses an image called 1x1.png served at the
 * (non-validating) domain servfail.sidnlabs.nl. If you do not want
 * to rely on this image being served in the future, replace it with
 * an image served on a non-validating domain, and set the URL with
 * sidn_dnssec_set_test_image()
 * 
 * Notes:
 * - This relies on a timeout and hence on the speed of the resolver.
 *   We set the timeout to 2000 ms, which should be a reasonable
 *   compromise between speed and reliability, but it could result in
 *   a false negative if no DNS responses from sidnlabs.nl (or 
 *   whichever test domain is set) have been cached in the resolver.
 * - Since we only test symptoms, there are certain error conditions
 *   that result in a false positive, such as general DNS resolution
 *   failure. Care should be taken when relying on this test.
 * 
 *
 * (c) Copyright SIDN Labs, 2014.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * See <http://www.gnu.org/licenses/>
 */

// Global variable to hold settings and the timer
var sidn_dnssec = {};
sidn_dnssec.timer = null;
sidn_dnssec.timeout = 2000;
sidn_dnssec.img_test = "//servfail.sidnlabs.nl/1x1.png"
sidn_dnssec.img_checking = "dnssec_checking.png"
sidn_dnssec.img_success = "dnssec_secure.png"
sidn_dnssec.img_failed = "dnssec_insecure.png"
sidn_dnssec.txt_checking = "Checking DNSSEC Validation"
sidn_dnssec.txt_success = "DNSSEC Validation is enabled"
sidn_dnssec.txt_failed = "DNSSEC Validation is not enabled"

//
// Setters
//

// Change the timeout value, increase if there are false positives
function sidn_dnssec_set_timeout(timeout) {
	sidn_dnssec.timeout = timeout;
}

// Change the test image. This must be an existing image, served
// on a domain that resolves without DNSSEC, but fails to resolve
// *with* DNSSEC validation. One relatively easy way is to mangle
// the RRSIG in the signed dns zone of the domain name.
function sidn_dnssec_set_test_image(image_url) {
	sidn_dnssec.img_test = image_url;
}

// Change the image that is shown if there is DNSSEC validation
function sidn_dnssec_set_success_image(image_url) {
	sidn_dnssec.img_success = image_url;
}

// Change the text that is shown if there is DNSSEC validation
function sidn_dnssec_set_success_text(text) {
	sidn_dnssec.txt_success = text;
}

// Change the image that is shown if there is *no* DNSSEC validation
function sidn_dnssec_set_failure_image(image_url) {
	sidn_dnssec.img_failed = image_url;
}

// Change the text that is shown if there is *no* DNSSEC validation
function sidn_dnssec_set_failure_text(text) {
	sidn_dnssec.txt_failed = text;
}

// Change the image that is shown while the test is waiting for results
function sidn_dnssec_set_checking_image(image_url) {
	sidn_dnssec.img_checking = image_url;
}

// Change the text that is shown while the test is waiting for results
function sidn_dnssec_set_checking_text(text) {
	sidn_dnssec.txt_checking = text;
}

//
// End of setters
//

// Update the div with given image url and given alt text
function sidn_dnssec_set_status(image_url, image_text) {
	html = '<img src="' + image_url + '" alt="' + image_text + '" />';
	jQuery("#sidn_dnssec_check").html(html);
}

// The pixel got loaded. Obviously there is no validation
function sidn_dnssec_pixel_loaded() {
	// remove the pixel again
	jQuery('#sidn_dnssec_check_pixel').remove();
	// cancel the timer, and show failed status
	clearTimeout(sidn_dnssec.timer);
	sidn_dnssec_set_status(sidn_dnssec.img_failed,
	                       sidn_dnssec.txt_failed)
}

// The pixel failed to load in time, so we assume the failure
// implies DNSSEC validation.
function sidn_dnssec_pixel_not_loaded() {
	sidn_dnssec_set_status(sidn_dnssec.img_success,
	                       sidn_dnssec.txt_success)
}

// The main test.
function sidn_dnssec_validation_check() {
	// Set image and text to 'running'
	sidn_dnssec_set_status(sidn_dnssec.img_checking,
	                       sidn_dnssec.txt_checking);

	// Try to load an image that should fail. If it succeeds, there
	// is no dnssec validation.
	jQuery('body').append('<img src="' + sidn_dnssec.img_test + '"' +
	                      'width="1" height="1" ' +
	                      'id="sidn_dnssec_check_pixel" ' +
	                      'alt="" ' +
	                      'onload="sidn_dnssec_pixel_loaded();" />')
	// Start a timer, if it times out, we have validation (since
	// the pixel never loaded).
	sidn_dnssec.timer = setTimeout(sidn_dnssec_pixel_not_loaded,
	                               sidn_dnssec.timeout);
}

// Initialize it automatically on startup.
jQuery(document).ready(sidn_dnssec_validation_check);
