/*global vhc_wc_purchased_items_column_params */
( function ( $ ) {
  if ( "undefined" === typeof vhc_wc_purchased_items_column_params ) {
    return;
  }

  const helper = {
    remove_panel: () => {
      const panel = $( document ).find( ".vhc-items-panel" );
      if ( panel.length ) {
        panel.removeClass( "is-open" );
        setTimeout( () => panel.remove(), 100 );
        $( "#wpcontent" )[ 0 ].removeEventListener( "click", helper.close_panel );
      }
    },
    get_panel: ( order = "", count = 0 ) => {
      const heading = vhc_wc_purchased_items_column_params.i18n_order_items.replace( "%s", `#${order}` );
      count = "undefined" === typeof count || count < 1 ? 1 : +count;
      const placeholder = `<section class="items-card empty-card"><span class="card-icon" aria-hidden="true"><span class="placeholder"></span></span><header class="card-header"><h4 class="card-title placeholder"></h4></header><div class="card-body"><span class="placeholder"></span></div></section>`;
      let wrapper = `<div class="vhc-items-panel"><div class="panel-content"><div class="panel-header"><h3>${heading}</h3></div><div class="panel-content-inner">${placeholder.repeat(count)}</div>`;
      return wrapper;
    },
    adjust_panel: () => {
      const layout = $( ".woocommerce-layout__header" );
      const adminbar = $( document ).find( "#wpadminbar" );
      const panel = $( document ).find( ".vhc-items-panel" );
      const height = ( layout.length ? layout.height() : 0 ) + ( adminbar.length ? adminbar.height() : 0 );
      panel.css( {
        top: `${height}px`,
        height: `calc(100vh - ${height}px)`,
      } );
    },
    close_panel: ( event ) => {
      if ( $( event.target ).closest( ".vhc-items-panel" ).length === 0 && !$( event.target ).hasClass( "vhc-show-order-items" ) ) {
        // Remove panel.
        helper.remove_panel();
      }
    },
  };

  $( document ).on( "click touch", ".vhc-show-order-items:not(.disabled)", ( event ) => {
    event.preventDefault();

    // Define variables.
    let wrapper;
    const button = $( event.currentTarget );
    const order_id = button.data( "id" );
    const count = button.data( "count" );

    // Remove panel.
    helper.remove_panel();

    // Check if Order ID exists.
    if ( "undefined" === typeof order_id || "" === order_id ) {
      return;
    }

    // Send ajax request.
    $.ajax( {
      type: "POST",
      url: vhc_wc_purchased_items_column_params.ajax_url,
      data: {
        nonce: vhc_wc_purchased_items_column_params.nonce,
        action: "vhc_wc_purchased_items_column_fetch_items_ajax",
        order_id: order_id,
      },
      dataType: "json",
      beforeSend: function () {
        // Prepanel panel in wrap element.
        $( ".wrap" ).prepend( helper.get_panel( order_id, count ) );

        // Adjust panel height.
        helper.adjust_panel();

        // Find wrapper element.
        wrapper = $( document ).find( ".vhc-items-panel" );

        // Display wrapper after timeout.
        setTimeout( () => wrapper.addClass( "is-open" ), 100 );

        // Disabled all the order items buttons.
        $( ".vhc-show-order-items" ).addClass( "disabled" );
      },
      success: ( response ) => {
        if ( response.success ) {
          setTimeout( () => wrapper.find( ".panel-content-inner" ).html( response.data.items ), 300 );
          $( "#wpcontent" )[ 0 ].addEventListener( "click", helper.close_panel );
        } else {
          // Remove panel.
          helper.remove_panel();
          // Alert error.
          alert( response.data.error );
        }
      },
      error: () => {
        // Remove panel.
        helper.remove_panel();
        // Alert error.
        alert( vhc_wc_purchased_items_column_params.i18n_something_went_wrong );
      },
      complete: () => {
        // Enabled all the order items buttons again.
        $( ".vhc-show-order-items" ).removeClass( "disabled" );
      },
    } );
  } );

  $( window ).on( "resize", () => $( window ).width() <= 782 && helper.remove_panel() );
} )( jQuery );