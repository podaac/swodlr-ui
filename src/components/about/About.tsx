import { Col, ListGroup, Row, Image } from "react-bootstrap";
import { parameterHelp, parameterOptions } from '../../constants/rasterParameterConstants'
import CompareImage from '../../assets/comparing-images.png'
import YukonImage from '../../assets/SWOT-YUKON.jpeg'
import LatLongUTM from '../../assets/lat-lon-vs-utm.png'
import UpSWOTResolution from '../../assets/swot-go-up-resolution.jpg'
import packageJson from '../../../package.json'
import { ReactElement, useEffect, useState } from "react";

const About = () => {
    const [backendVersion, setBackendVersion] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            setBackendVersion(await fetch(`${process.env.REACT_APP_SWODLR_API_BASE_URI}/about`).then((version) => version.json()).then(response => response.version))
        }
        fetchData()
        .catch(console.error);
      }, []);
      
    return (
        <Col className="about-page" style={{marginTop: '70px', paddingRight: '12px', marginLeft: '0px', height: '100%'}}>
            <Row><h4 style={{marginTop: '10px', marginBottom: '20px'}}>About: SWOT On-Demand Level-2 Raster Generator</h4></Row>

            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <h4 style={{marginTop: '10px',marginBottom: '20px', borderBottom: 'solid 1px'}}>Summary</h4>
                <div className='howToListItem' style={{marginBottom: '20px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h5>
                        SWODLR is an on-demand raster generation tool that generates customized Surface Water and Ocean Topography (SWOT) Level 2 raster products. SWOT standard products are released in geographically fixed tiles at 100m and 250m resolutions in a Universal Transverse Mercator (UTM) projection grid. SWODLR allows users to generate the same products at different resolutions in either the UTM or geodetic coordinate system (lat/lon). SWODLR also gives an option to change the output granule extent from a nonoverlapping square 128 km x 128 km to an overlapping rectangle 256 km x 128 km to assist with observing areas of interest near the along-track edges of the original square extent.
                    </h5>
                    <h5>
                        Like the standard product, the on-demand product contains rasterized water surface elevation and inundation-extents. This is derived through resampling the upstream pixel cloud (L2_HR_PIXC) and pixel vector (L2_HR_PIXCVEC) datasets onto a uniform grid. A uniform grid is superimposed onto the pixel cloud from the source products, and all pixel-cloud samples within each grid cell are aggregated to produce a single value per raster cell. SWODLR uses the <a href='https://archive.podaac.earthdata.nasa.gov/podaac-ops-cumulus-docs/web-misc/swot_mission_docs/atbd/D-105507_SWOT_ATBD_L2_HR_Raster_w-sigs.pdf' target="_">original algorithm</a> that standard SWOT products use to generate products but at a different resolution; it does not just re-grid the standard products.
                    </h5>
                </div>
            </Row>

            <Row className='about-card' style={{ marginLeft: '10%', marginRight: '10%', marginBottom: '40px'}}>
                <div style={{paddingTop: '20px', paddingBottom: '30px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginBottom: '20px'}}>Use Cases</h4>
                    <ListGroup>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row className="align-items-center">
                                <Col><h5>Comparing SWOT water extent products to other NASA products like Landsat with alternate resolutions</h5></Col>
                                <Col><Image src={CompareImage} fluid/></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row className="align-items-center">
                                <Col><Image src={UpSWOTResolution} fluid/></Col>
                                <Col><h5>Modeling, using SWODLR to obtain finer scale resolutions of SWOT data to either inform or compare to model outputs</h5></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row className="align-items-center">
                                <Col><h5>Observing floodplains, river deltas and other complex hydrological environments at finer spatial resolutions than the standard SWOT products.</h5></Col>
                                <Col><Image src={YukonImage} fluid/></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row className="align-items-center">
                                <Col><Image src={LatLongUTM} fluid/></Col>
                                <Col><h5>Using lat/lon coordinates is easier to stitch data tiles together than using the UTM coordinate system.</h5></Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>

            <Row className='about-card' style={{ marginLeft: '10%', marginRight: '10%', marginBottom: '40px'}}>
                <div style={{paddingTop: '20px', paddingBottom: '30px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginBottom: '20px'}}>FAQ</h4>
                    <ListGroup style={{marginBottom: '20px'}}>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row className="align-items-center"><h5>Q: How do I find cycle, pass, and scene?</h5></Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row><h5>A: The cycle, pass, and scene IDs can be found in the file name of the standard raster product. The files can be explored within {<a href="https://search.earthdata.nasa.gov/search/granules?p=C2799438271-POCLOUD&pg[0][v]=f&pg[0][gsk]=-start_date&q=SWOT_L2_HR_RASTER_2.0&tl=1705536407!3!!&lat=65.390625&zoom=1" target="_">Earthdata Search</a>}. The file naming convention is like so: {`SWOT_L2_HR_Raster_<DescriptorString>_<CycleID>_<PassID>_<SceneID>
                            _<RangeBeginningDateTime>_<RangeEndingDateTime>_<CRID>_<ProductCounter>.nc`}</h5></Row>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>

            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <div className='about-card' style={{paddingTop: '20px', paddingBottom: '30px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginBottom: '20px'}}>Definitions</h4>
                    <ListGroup>
                    {Object.entries(parameterHelp).map((entry, index) => {
                        return (
                            <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}} key={`definition-${index}`}>
                                <Row><h5><b>{parameterOptions[entry[0] ]}</b></h5></Row>
                                <Row><h5>{entry[1]}</h5></Row>
                            </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </div>
            </Row>


            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <div className='howToListItem' style={{marginBottom: '20px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginTop: '10px',marginBottom: '20px', borderBottom: 'solid 1px'}}>Citations</h4>
                    <h5>
                        <b>When using data products from SWODLR, please cite both the SWODLR tool and the original source data product.</b>
                    </h5>
                    <h5>Tool Citation</h5>
                    <h5>
                        PO.DAAC. (YYYY). SWOT On-Demand Level 2 Raster Generation (SWODLR). NASA EOSDIS Physical Oceanography Distributed Active Archive Center (PO.DAAC), Pasadena, California, USA. Accessed Month dd, yyyy. INSERT SWODLR URL
                    </h5>
                    <h5>Product Citation</h5>
                    <h5>
                        Get from the dataset landing page when data is published like the citation tab on the <a href="https://podaac.jpl.nasa.gov/dataset/SWOT_SIMULATED_NA_CONTINENT_L2_HR_RASTER_V1" target="_">simulated raster data landing page</a>.
                    </h5>
                </div>
            </Row>

            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <div className='howToListItem' style={{marginBottom: '20px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginTop: '10px', marginBottom: '20px'}}>References</h4>
                    <ListGroup>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row><h5 style={{marginTop: '10px'}}><a href="https://forum.earthdata.nasa.gov/viewforum.php?f=7&tagMatch=all&DAAC=146&keywords=&sid=970ecb7a5612cbf44f6d7c1525019147" target="_">EarthData Forum for SWODLR</a></h5></Row>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>

            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <div className='howToListItem' style={{marginBottom: '20px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginTop: '10px', marginBottom: '20px'}}>Acknowledgements</h4>
                    <ListGroup>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row><h5><b>Algorithms Team</b></h5></Row>
                            <Row><h5>The output is generated by the same processor used to generate the standard science data product, developed by the SWOT ADT.</h5></Row>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>

            <Row className='about-card' style={{marginRight: '10%', marginLeft: '10%', marginBottom: '40px'}}>
                <div className='howToListItem' style={{marginBottom: '20px', paddingRight: '5%', paddingLeft: '5%'}}>
                    <h4 style={{marginTop: '10px', marginBottom: '20px'}}>Current Version</h4>
                    <ListGroup>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row>
                                <h5>
                                    <b>SWODLR UI: </b> 
                                    {packageJson.version}
                                </h5>
                            </Row>
                            <Row><h5><a href="https://github.com/podaac/swodlr-ui/releases" target="_">{`(Release Notes)`}</a></h5></Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='howToListItem' style={{marginRight: '0%', marginLeft: '0%'}}>
                            <Row>
                                <h5>
                                    <b>SWODLR API: </b>
                                    {backendVersion}
                                </h5>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>
        </Col> as ReactElement
    );
}

export default About;