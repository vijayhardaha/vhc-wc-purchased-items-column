<?php
/**
 * Plugin Name: WooCommerce Purchased Items Column
 * Plugin URI: https://twitter.com/vijayhardaha/
 * Description: This plugin simply display a Purchased Items column on the WooCommerce orders page.
 * Version: 1.0.0
 * Author: Vijay Hardaha
 * Author URI: https://twitter.com/vijayhardaha/
 * License: GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: wc-purchased-items-column
 * Domain Path: /languages/
 *
 * @package WC_Purchased_Items_Column
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

if ( ! defined( 'WC_PURCHASED_ITEMS_COLUMN_PLUGIN_FILE' ) ) {
	define( 'WC_PURCHASED_ITEMS_COLUMN_PLUGIN_FILE', __FILE__ );
}

// Include the main WC_Purchased_Items_Column class.
if ( ! class_exists( 'WC_Purchased_Items_Column', false ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-wc-purchased-items-column.php';
}

/**
 * Returns the main instance of WC_Purchased_Items_Column.
 *
 * @since  1.0.0
 * @return WC_Purchased_Items_Column
 */
function wc_purchased_items_column() {
	return WC_Purchased_Items_Column::instance();
}

// Global for backwards compatibility.
$GLOBALS['wc_purchased_items_column'] = wc_purchased_items_column();
