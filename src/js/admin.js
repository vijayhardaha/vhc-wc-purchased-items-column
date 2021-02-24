/*global wc_purchased_items_column_params */
( function( $ ) {
  if ( "undefined" === typeof wc_purchased_items_column_params ) {
    return;
  }

  const APP = {
    init: () => {


      $( document )
        .on( "click", ".wc-show-order-items", ( e ) => {
          e.preventDefault();

          let wrapper;
          const button = $( e.currentTarget );
          const order = button.data( "id" );
          const count = button.data( "count" );

          APP.removeWrapper();

          if ( "undefined" === typeof order || "" === order ) {
            return;
          }

          $.ajax( {
            type: "POST",
            url: wc_purchased_items_column_params.ajax_url,
            data: {
              nonce: wc_purchased_items_column_params.nonce,
              action: "wc_purchased_items_column_fetch_items_ajax",
              order_id: order,
            },
            dataType: "json",
            beforeSend: function() {
              $( ".wrap" ).prepend( APP.getWrapper( order, count ) );

              wrapper = $( document ).find( ".wc-order-items-panel-wrapper" );
              setTimeout( () => wrapper.addClass( "is-open" ), 100 );

              $( ".wc-show-order-items" ).addClass( "disabled" );
            },
            success: ( response ) => {
              $( ".wc-show-order-items" ).removeClass( "disabled" );

              if ( response.success ) {
                wrapper.find( ".wc-order-items-panel-content-inner" ).html( response.data.items );
              } else {
                APP.removeWrapper();
                alert( response.data.error );
              }
            },
            error: () => {
              $( ".wc-show-order-items" ).removeClass( "disabled" );
              APP.removeWrapper();
              alert( wc_purchased_items_column_params.i18n_something_went_wrong );
            }
          } );
        } )

        .on( "click", "#wpcontent", function( event ) {
          if ( $( event.target ).closest( ".wc-order-items-panel-wrapper" ).length === 0 && !$( event.target ).hasClass( "wc-show-order-items" ) ) {
            APP.removeWrapper();
          }
        } );
    },
    getWrapper: ( order = '', count = 0 ) => {
      const heading = wc_purchased_items_column_params.i18n_order_items.replace( '%s', `#${order}` );
      count = "undefined" === typeof count || count < 1 ? 1 : +count;

      const sectionPlaceholder = `<section class="wc-order-items-card empty-card"><span class="wc-order-items-card-icon" aria-hidden="true"><span class="placeholder"></span></span><header class="wc-order-items-card-header"><h4 class="wc-order-items-card-title placeholder"></h4></header><div class="wc-order-items-card-body"><span class="placeholder"></span></div></section>`;

      let wrapper = `<div class="wc-order-items-panel-wrapper"><div class="wc-order-items-panel-content"><div class="wc-order-items-panel-header"><h3>${heading}</h3></div><div class="wc-order-items-panel-content-inner">${sectionPlaceholder.repeat(count )}</div>`;

      return wrapper;
    },
    removeWrapper: () => {
      const wrapper = $( document ).find( ".wc-order-items-panel-wrapper" );
      if ( wrapper.length ) {
        wrapper.removeClass( "is-open" );
        setTimeout( () => wrapper.remove(), 100 );
      }
    }
  };
  APP.init();
} )( jQuery );