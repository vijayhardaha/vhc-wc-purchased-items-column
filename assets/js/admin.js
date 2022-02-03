/*global vhc_wc_purchased_items_column_params */
( function ( $ ) {
  if ( "undefined" === typeof vhc_wc_purchased_items_column_params ) {
    return;
  }

  const remove_panel = () => {
    const panel = $( document ).find( ".vhc-order-items-panel" );
    if ( panel.length ) {
      panel.removeClass( "is-open" );
      setTimeout( () => panel.remove(), 100 );
    }
  };

  const get_panel = ( order = "", count = 0 ) => {
    const heading = vhc_wc_purchased_items_column_params.i18n_order_items.replace( "%s", `#${order}` );
    count = "undefined" === typeof count || count < 1 ? 1 : +count;

    const sectionPlaceholder = `<section class="vhc-order-items-card empty-card"><span class="vhc-order-items-card-icon" aria-hidden="true"><span class="placeholder"></span></span><header class="vhc-order-items-card-header"><h4 class="vhc-order-items-card-title placeholder"></h4></header><div class="vhc-order-items-card-body"><span class="placeholder"></span></div></section>`;

    let wrapper = `<div class="vhc-order-items-panel"><div class="vhc-order-items-panel-content"><div class="vhc-order-items-panel-header"><h3>${heading}</h3></div><div class="vhc-order-items-panel-content-inner">${sectionPlaceholder.repeat(count)}</div>`;

    return wrapper;
  };

  const calculate_margin = () => {
    const layout = $( ".woocommerce-layout__header" );
    const adminbar = $( document ).find( "#wpadminbar" );
    const panel = $( document ).find( ".vhc-order-items-panel" );
    const height = ( layout.length ? layout.height() : 0 ) + ( adminbar.length ? adminbar.height() : 0 );
    panel.css( {
      top: `${height}px`,
      height: `calc(100vh - ${height}px)`
    } );
  };

  $( document )
    .on( "click", ".vhc-show-order-items", ( e ) => {
      e.preventDefault();

      let wrapper;
      const button = $( e.currentTarget );
      const order = button.data( "id" );
      const count = button.data( "count" );

      remove_panel();

      if ( "undefined" === typeof order || "" === order ) {
        return;
      }

      $.ajax( {
        type: "POST",
        url: vhc_wc_purchased_items_column_params.ajax_url,
        data: {
          nonce: vhc_wc_purchased_items_column_params.nonce,
          action: "vhc_wc_purchased_items_column_fetch_items_ajax",
          order_id: order,
        },
        dataType: "json",
        beforeSend: function () {
          $( ".wrap" ).prepend( get_panel( order, count ) );
          calculate_margin();
          wrapper = $( document ).find( ".vhc-order-items-panel" );
          setTimeout( () => wrapper.addClass( "is-open" ), 100 );
          $( ".vhc-show-order-items" ).addClass( "disabled" );
        },
        success: ( response ) => {
          $( ".vhc-show-order-items" ).removeClass( "disabled" );

          if ( response.success ) {
            setTimeout( () => wrapper.find( ".vhc-order-items-panel-content-inner" ).html( response.data.items ), 300 );
          } else {
            remove_panel();
            alert( response.data.error );
          }
        },
        error: () => {
          $( ".vhc-show-order-items" ).removeClass( "disabled" );
          remove_panel();
          alert( vhc_wc_purchased_items_column_params.i18n_something_went_wrong );
        },
      } );
    } )

    .on( "click", "#wpcontent", function ( event ) {
      if ( $( event.target ).closest( ".vhc-order-items-panel" ).length === 0 && !$( event.target ).hasClass( "vhc-show-order-items" ) ) {
        remove_panel();
      }
    } );

  $( window ).on( "resize", () => remove_panel() );
} )( jQuery );