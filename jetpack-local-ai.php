<?php
/**
 * Plugin Name:     Jetpack Local AI
 * Description:     AI for Jetpack.
 * Version:         0.0.1
 * Author:          Artur Piszek (artpi)
 * Author URI:      https://piszek.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     jetpack-local-ai
 *
 * @package         artpi
 */


function local_ai_enqueue_assets() {
	$script_asset = require plugin_dir_path( __FILE__ ) . '/build/index.asset.php';
	wp_enqueue_script(
		'jetpack-local-ai',
		plugins_url( 'build/index.js', __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);
}

add_action( 'init', function() {
	add_action( 'enqueue_block_editor_assets', 'local_ai_enqueue_assets' );
} );

