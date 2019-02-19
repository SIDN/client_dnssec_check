client_dnssec_check
===================

Customizable script to place on your website that shows whether
visitors validate DNSSEC.

While running, it will default to showing the image:

![Image while running](dnssec_checking.png)

Upon successful detection of DNSSEC validation, the image shall be
updated to:

![Validation detected](dnssec_secure.png)

If, however, the script detect that no DNSSEC validation is performed,
it shall update the image to:

![no validation detected](dnssec_insecure.png)

Example: https://www.sidnlabs.nl/ (all the way in the top).

Installation
------------

Include this script in your website, and an empty <div> with id 
'sidn\_dnssec\_check' somewhere on the website page(s).

    <div id="sidn_dnssec_check"></div>

The script automatically runs, and tries to resolve a domain name
that should not validate. If that succeeds it will hide the
'checking' image, and shows 'sidn\_dnssec\_insecure'. If it does
not succeed, it will show the 'sidn\_dnssec\_secure' image.

Configuration
-------------

Images, or replacement texts, can be changed in the calling
code. See example.html for an example.

By default, it uses an image called 1x1.png served at the
(non-validating) domain servfail.sidnlabs.nl. If you do not want
to rely on this image being served in the future, replace it with
an image served on a non-validating domain, and set the URL with
sidn_dnssec_set_test_image()

    sidn_dnssec_set_timeout(2000);
    sidn_dnssec_set_test_image('//servfail.sidnlabs.nl/1x1.png');
    sidn_dnssec_set_checking_image('dnssec_checking.png');
    sidn_dnssec_set_checking_text('Checking DNSSEC Validation');
    sidn_dnssec_set_success_image('dnssec_secure.png');
    sidn_dnssec_set_success_text('DNSSEC Validation is enabled');
    sidn_dnssec_set_failure_image('dnssec_insecure.png');
    sidn_dnssec_set_failure_text('DNSSEC Validation is not enabled');


Notes
-----

* This relies on a timeout and hence on the speed of the resolver.
  We set the timeout to 2000 ms, which should be a reasonable
  compromise between speed and reliability, but it could result in
  a false negative if no DNS responses from sidnlabs.nl (or 
  whichever test domain is set) have been cached in the resolver.
* Since we only test symptoms, there are certain error conditions
  that result in a false positive, such as general DNS resolution
  failure. Care should be taken when relying on this test.

Authors
-------

Original idea and code by Marco Davids

Rewrite and updates by Jelte Jansen

(c) 2014 SIDN Labs

License
-------

Licensed under the GPL version 3.
