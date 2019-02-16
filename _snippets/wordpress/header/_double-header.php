<div class="top-header">
		<div class="container">
			<div class="row">
				<div class="col-12 col-md-4">
					<div class="phone-data">
						<span class="icon-phone-circle mr-1"></span>
						57-3395-1212
					</div>
				</div>
				<div class="col-12 col-md-4">
					<div class="span-text text-uppercase">
						Attending
						<b>24 Hours</b>
					</div>
				</div>
				<div class="col-12 col-md-4">
					<ul class="social__list">
						<li><a href=""><span class="icon-facebook-circle"></span></a></li>
						<li><a href=""><span class="icon-instagram-circle"></span></a></li>
						<li><a href=""><span class="icon-youtube-circle"></span></a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
<header id="masthead" class="site-header">
		<div class="container">
			<nav class="navbar navbar-expand-lg">
				<?php
				$custom_logo_id=null;$custom_logo_url=null;
				if(function_exists('get_theme_mod')){
					$custom_logo_id =  get_theme_mod('custom_logo');
					$custom_logo_url = (get_post_meta( $custom_logo_id, '_wp_attachment_image_alt', true ));
				}
				?>
				<?php
				if($custom_logo_id):
					the_custom_logo();
				else:
					$header_logo_url = get_template_directory_uri().'/images/header-logo.png';
					$header_title = get_bloginfo('name');
					?>
					<a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<img src="<?php _e($header_logo_url)?>" alt="<?php _e($header_title)?>">
					</a>
				<?php
				endif
				?>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
					<span class="icon-menu"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarTogglerDemo03">
					<?php
					if ( has_nav_menu( 'c_header_menu' ) ) {
						get_default_header_menu( 'c_header_menu', [] );
					}
					?>
				</div>
			</nav>
		</div>
	</header><!-- #masthead -->