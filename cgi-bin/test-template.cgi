#!/usr/bin/perl
use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use HTML::Template;
use HTML::FillInForm;

my $query = new CGI;
my @params = $query->param;

foreach my $key (@params) {
    my $value = $query->param($key);
}

my $tmpl = HTML::Template->new(
    filename => './tmpl/test.tmpl',
    associate => $query,
    );

$tmpl->param(
    name => "Jun Kaneko",
    hobby => "サーフィン",
    );

    
print $query->header( -charset => "UTF-8" );
print $tmpl->output;


