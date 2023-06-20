import { ListGroup, Row } from "react-bootstrap";
import { parameterHelp, parameterOptions } from '../../constants/rasterParameterConstants'

const About = () => {

    return (
        <div className="about-page" style={{marginTop: '70px'}}>
            <Row><h3 style={{marginTop: '10px', marginBottom: '20px'}}>About: SWOT On-Demand Level-2 Raster Generator</h3></Row>
            <Row><h4 style={{marginTop: '10px', marginBottom: '20px'}}>Use Cases</h4></Row>
            <Row>
                <ListGroup>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Comparing SWOT water extent products to other NASA products like Landsat with alternate resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Modeling, using SWODLR to obtain finer scale resolutions of SWOT data to either inform or compare to model outputs</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Researchers looking at floodplains and river deltas express the desire for finer spatial resolutions than the standard 100 m or 250 m resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%'}}>Using lat/lon coordinates is easier to stitch data tiles together than using the UTM coordinate system.</ListGroup.Item>
                </ListGroup>
            </Row>
            <Row><h4 style={{marginTop: '10px', marginBottom: '20px'}}>Definitions</h4></Row>
            <Row>
                <ListGroup>
                    {Object.entries(parameterHelp).map((entry, index) => {
                        return (
                            <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: index === Object.entries(parameterHelp).length - 1 ? '' : 'solid 1px'}}>
                                <Row><h5>{parameterOptions[entry[0] ]}</h5></Row>
                                <Row>{entry[1]}</Row>
                            </ListGroup.Item>
                            )
                    })}
                </ListGroup>
            </Row>
            {/* <Row><h3 style={{marginTop: '10px', marginBottom: '20px'}}>FAQ</h3></Row>
            <Row>
                <ListGroup>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Comparing SWOT water extent products to other NASA products like Landsat with alternate resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Modeling, using SWODLR to obtain finer scale resolutions of SWOT data to either inform or compare to model outputs</ListGroup.Item>
                    <ListGroup.Item className='howToListItem' style={{marginRight: '20%', marginLeft: '20%', borderBottom: 'solid 1px'}}>Researchers looking at floodplains and river deltas express the desire for finer spatial resolutions than the standard 100 m or 250 m resolutions</ListGroup.Item>
                    <ListGroup.Item className='howToListItem'style={{marginRight: '20%', marginLeft: '20%'}}>Using lat/lon coordinates is easier to stitch data tiles together than using the UTM coordinate system.</ListGroup.Item>
                </ListGroup>
            </Row> */}
        </div>
    );
}

export default About;