package FlickrView;

use strict;
use warnings;
use base 'CGI::Application';

sub setup {
    my $self = shift;

    $self->tmpl_path('./tmpl/');
    $self->start_mode('home');
    $self->error_mode('showerror');
    $self->run_modes(
        'home' => 'showhome',
        'list' => 'showlist',
        'detail' => 'showdetail',
        );

    $self->param('charset' => 'UTF-8');
}

# 終了処理
sub teardown {
    my $self = shift;
}

sub showhome {
    my $self = shift;
    my $q = $self->query();

    my $output = '';
    $output .= $self->dump_html();
    
    my $tmpl = $self->load_tmpl;
    $tmpl->param(
        'title' => 'Hello World',
        'output' => $output,
        );
    
    return $tmpl->output;
}

sub showlist {
    my $self = shift;
    my $q = $self->query();
    
    
    return $output;
}
  
sub showdetail {
    my $self = shift;
    
    # CGIクエリオブジェクトの取得
    my $q = $self->query();
    my $widgetid = $q->param("widgetid");
    
    my $output = '';
    $output .= $q->start_html(-title => 'Widget Detail');
    
    $output .= $q->end_html();
    
    return $output;
}
  
sub showerror {

}

# HTTPヘッダ作成前のコールバック
sub cgiapp_postrun {
    
    my $self = shift;
    my $charset = uc($self->param('charset'));
    my $charmap = { 'ISO-2022-JP' => 'jis', 'SHIFT_JIS' => 'sjis', 'EUC-JP' => 'euc', 'UTF-8' => 'utf8' };
    if (defined($charset) and defined($charmap->{$charset})) {
        $self->header_add('-charset', $self->param('charset'));
    }
}


1;  # Perlではすべてのモジュールの最後にこれが必要
