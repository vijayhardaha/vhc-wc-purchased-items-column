<?php
/**
 * Plugin Name: VHC WooCommerce Purchased Items Column
 * Plugin URI: https://github.com/vijayhardaha/vhc-wc-purchased-items-column
 * Description: Simply displays a Purchased Items column on the WooCommerce orders page.
 * Version: 1.1.0
 * Author: Vijay Hardaha
 * Author URI: https://twitter.com/vijayhardaha/
 * Text Domain: vhc-wc-purchased-items-column
 * Domain Path: /languages/
 * Requires at least: 5.4
 * Requires PHP: 5.6
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package VHC_WC_Purchased_Items_Column
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'get_plugin_data' ) ) {
	require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

if ( ! defined( 'VHC_WC_PURCHASED_ITEMS_COLUMN_PLUGIN_FILE' ) ) {
	define( 'VHC_WC_PURCHASED_ITEMS_COLUMN_PLUGIN_FILE', __FILE__ );
}

// Include the main VHC_WC_Purchased_Items_Column class.
if ( ! class_exists( 'VHC_WC_Purchased_Items_Column', false ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-vhc-wc-purchased-items-column.php';
}

/**
 * Returns the main instance of VHC_WC_Purchased_Items_Column.
 *
 * @since 1.0.0
 * @return VHC_WC_Purchased_Items_Column
 */
function vhc_wc_purchased_items_column() {
	return VHC_WC_Purchased_Items_Column::instance();
}

// Global for backwards compatibility.
$GLOBALS['vhc_wc_purchased_items_column'] = vhc_wc_purchased_items_column();
