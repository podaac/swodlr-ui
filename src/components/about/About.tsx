import { Col, ListGroup, Row } from "react-bootstrap";
import { parameterHelp, parameterOptions } from '../../constants/rasterParameterConstants'

const About = () => {

    return (
        <Col className="about-page" style={{marginTop: '70px', paddingRight: '12px', marginLeft: '12px', height: '100%'}}>
            <Row><h4 style={{marginTop: '10px', marginBottom: '20px'}}>About: SWOT On-Demand Level-2 Raster Generator</h4></Row>
            <Row style={{marginRight: '20%', marginLeft: '20%'}}>
                <div className='howToListItem'>
                <p>
                    SWODLR is an on-demand raster generation tool that generates customized Surface Water and Ocean Topography (SWOT) Level 2 raster products. SWOT standard products are released in geographically fixed tiles at 100m and 250m resolutions in a Universal Transverse Mercator (UTM) projection grid. SWODLR allows users to generate the same products at different resolutions in either the UTM or geodetic coordinate system (lat/lon). SWODLR also gives an option to change the output granule extent from a square 128 x 128 km to 256 x 128 km for a potentially more accurate view of raster cells on the edges of the original square extent.
                </p>
                <p>
                    Like the standard product, the on-demand product contains rasterized water surface elevation and inundation-extents. This is derived through resampling the upstream pixel cloud (L2_HR_PIXC) and pixel vector (L2_HR_PIXCVEC) datasets onto a uniform grid. A uniform grid is superimposed onto the pixel cloud from the source products, and all pixel-cloud samples within each grid cell are aggregated to produce a single value per raster cell. SWODLR uses the <a href='https://github.com/SWOTAlgorithms/Raster-Processor' target="_">original algorithm</a> that standard SWOT products use to generate products but at a different resolution; it does not just re-grid the standard products.
                </p>
                </div>
            </Row>
            <Row><h5 style={{marginTop: '10px', marginBottom: '20px'}}>Use Cases</h5></Row>
            <Row>
                <ListGroup>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}}>Comparing SWOT water extent products to other NASA products like Landsat with alternate resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}}>Modeling, using SWODLR to obtain finer scale resolutions of SWOT data to either inform or compare to model outputs</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}}>Researchers looking at floodplains and river deltas express the desire for finer spatial resolutions than the standard 100 m or 250 m resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}}>Using lat/lon coordinates is easier to stitch data tiles together than using the UTM coordinate system.</ListGroup.Item>
                </ListGroup>
            </Row>
            {/* <Row><h5 style={{marginTop: '10px', marginBottom: '20px'}}>FAQ</h5></Row> */}
            <Row><h5 style={{marginTop: '10px', marginBottom: '20px'}}>Definitions</h5></Row>
            <Row style={{paddingBottom: '20px'}}>
                <ListGroup>
                    {Object.entries(parameterHelp).map((entry, index) => {
                        return (
                            <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}} key={`definition-${index}`}>
                                <Row><h6><b>{parameterOptions[entry[0] ]}</b></h6></Row>
                                <Row>{entry[1]}</Row>
                            </ListGroup.Item>
                            )
                    })}
                </ListGroup>
            </Row>
            <Row><h5 style={{marginTop: '10px', marginBottom: '20px'}}>Citations</h5></Row>
            <Row style={{marginRight: '20%', marginLeft: '20%'}}>
                <div className='howToListItem'>
                    <p>
                        <b>When using data products from SWODLR, please cite both the SWODLR tool and the original source data product.</b>
                    </p>
                    <h6>Tool Citation</h6>
                    <p>
                        PO.DAAC. (YYYY). SWOT On-Demand Level 2 Raster Generation (SWODLR). NASA EOSDIS Physical Oceanography Distributed Active Archive Center (PO.DAAC), Pasadena, California, USA. Accessed Month dd, yyyy. INSERT SWODLR URL
                    </p>
                    <h6>Product Citation</h6>
                    <p>
                        Get from the dataset landing page when data is published like the citation tab on the <a href="https://podaac.jpl.nasa.gov/dataset/SWOT_SIMULATED_NA_CONTINENT_L2_HR_RASTER_V1" target="_">simulated raster data landing page</a>.
                    </p>
                </div>
            </Row>
        </Col>
    );
}

export default About;