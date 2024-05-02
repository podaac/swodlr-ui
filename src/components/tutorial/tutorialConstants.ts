export const tutorialSteps = [
    {
      target: "#customization-tab",
      content: "You are on the customization page. This is where you can add and customize scenes to be generated.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#select-scenes-breadcrumb",
      content: "You are on the select scenes view where scene selection takes place.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#spatial-search-options",
      content: "This is where you can change options when using the map to search for scenes such as changing the date range of scenes being searched.",
      disableBeacon: true,
      placement: 'right' as const,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
    target: '#map-tutorial-target',
      content: "This map allows you to search for scenes by drawing a search area and will display the footprints of scenes once they have been added to your Added Scenes list.",
      disableBeacon: true,
      placement: 'top-start' as const,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: ".leaflet-draw-draw-polygon",
      content: "Click to create a bounding box to specify scenes to customize. Scenes will be searched for after closing the bounding box.",
      disableBeacon: true,
      placement: 'left' as const,
      styles: {
          options: {
            zIndex: 1000,
            primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: ".leaflet-draw-edit-edit",
      content: "Click here to edit any existing scene search areas you have already drawn on the map. Note: after editing, the scenes will be searched again within the new bounding box.",
      disableBeacon: true,
      placement: 'left' as const,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: ".leaflet-draw-edit-remove",
      content: "Click here to delete selected search areas on your map. Save after deleting to save changes.",
      disableBeacon: true,
      placement: 'left' as const,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#added-scenes",
      content: "This is where you can manually add scenes and see your currently added scenes. Enter a scene's cycle, pass and scene id then click the Add Scenes button to manually add scenes to be customized and generated.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#remove-granules-button",
      content: "You can also remove added scenes by selecting them in the Remove column and clicking the red Delete button",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#alert-messages",
      content: "Alerts will inform you if your search was successful or if any errors ocurred.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#configure-options-breadcrumb",
      content: "You can also click on the Configure Options tab to proceed to the Configure Options view.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#parameter-options",
      content: "This is where you can configure options of how you want the scenes added in the previous view to be generated. Changing these options will affect all scenes in the table below. Hover over the circular info icon for more detailed explanations.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#scenes-to-customize",
      content: "This is the table showing the scenes you can customize. Scene specific options are also shown when applicable.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#generate-products-button",
      content: "Use this button when you are ready to generate the products in the Scenes to Customize List with your preferred scene options selected.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#my-data-page",
      content: "This page shows you the statuses of products once they have been created, as they are generating, when they are complete, and if an error occured.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#history-table",
      content: "This table shows more in depth details about the products that are being generated and that have been generated.",
      disableBeacon: true,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    },
    {
      target: "#download-url",
      content: "Once the status is 'READY', look in the 'Download URL' section t either download your product using the download button or copy and paste the link into your browser to download.",
      disableBeacon: true,
      placement: 'left' as const,
      styles: {
          options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
          }
      }
    }
]