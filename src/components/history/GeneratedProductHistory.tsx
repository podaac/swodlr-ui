import { Accordion, Alert, Badge, Button, Card, Col, ListGroup, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GeneratedProduct, StatusTypes } from "../../types/constantTypes";
import { useState } from "react";
import { Download, Clipboard } from "react-bootstrap-icons";
import { setCurrentPage } from "../app/appSlice";

const getBadgeColor = (status: StatusTypes) => {
    if (status === 'IN_PROGRESS') {
        return 'secondary'
    } else if (status === 'COMPLETE') {
        return 'success'
    }
}

const getBadgeLabel = (status: StatusTypes) => {
    if (status === 'IN_PROGRESS') {
        return 'Generation In Progress'
    } else if (status === 'COMPLETE') {
        return 'Complete'
    }
}

const GeneratedProductHistory = () => {
    const generatedProducts = useAppSelector((state) => state.product.generatedProducts)
    const dispatch = useAppDispatch()
    
    const [copyTooltipText, setCopyTooltipText] = useState('Click to Copy URL')

    const handleCopyClick = (downloadUrl: string) => {
        navigator.clipboard.writeText(downloadUrl)
        setCopyTooltipText('Copied!')
    }

    const renderHistoryContents = (
        <Row style={{marginLeft: '20px', marginRight: '20px', marginBottom: '20px', height: '80vh', overflowY: 'auto'}}>
            {generatedProducts.map((genProductObj: GeneratedProduct) => {
                const {productId, status, granuleId, parametersUsedToGenerate, downloadUrl} = genProductObj
                const {batchGenerateProductParameters, utmZoneAdjust, mgrsBandAdjust} = parametersUsedToGenerate
                return (
                    <Col style={{marginTop: '20px'}}>
                        <Card style={{ width: '18rem' }}>
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                        <Card.Body>
                            <Card.Title style={{color: 'black'}}>{granuleId}</Card.Title>

                                <Row style={{color: 'black'}}><h6>Parameters Used to Generate Product</h6></Row>
                                {Object.entries(batchGenerateProductParameters).map(entry => <Row><Col style={{color: 'black'}}>{`${entry[0]}: ${entry[1]}`}</Col></Row>)}
                                {batchGenerateProductParameters.outputSamplingGridType === 'utm' ? (
                                    <>
                                        <Row><Col style={{color: 'black'}}>{`utmZoneAdjust: ${utmZoneAdjust}`}</Col></Row>
                                        <Row><Col style={{color: 'black'}}>{`mgrsBandAdjust: ${mgrsBandAdjust}`}</Col></Row>
                                    </>
                                ): null}

                            {/* <Card.Text style={{color: 'black'}}>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                            </Card.Text> */}
                            <Row style={{color: 'black'}}><h6>Download URL</h6></Row>
                            <Row>{<a href={downloadUrl as string}>{downloadUrl}</a>}</Row>
                            <Row>
                                <Col>
                                <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip id="button-tooltip">{copyTooltipText}</Tooltip>
                                        }
                                    >
                                    <Button style={{backgroundColor: 'transparent', borderColor: 'white', color: 'black'}} onClick={() => {handleCopyClick(downloadUrl as string)}} onMouseLeave={() => setCopyTooltipText('Click to Copy URL')}><Clipboard/></Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col>
                                <Button style={{backgroundColor: 'transparent', borderColor: 'white', color: 'black'}} onClick={() => alert(`downloading url for ${granuleId}`)}><Download/></Button>
                                </Col>
                            </Row>
                            {/* <Button variant="primary">Go somewhere</Button> */}
                        </Card.Body>
                        </Card>
                    </Col>
                )
            })}
        </Row>
    )

    const renderListContents = (
        <Col style={{marginLeft: '20px', marginRight: '20px', marginBottom: '20px', height: '80vh'}}>
            <Accordion className="shadow" style={{overflowY: 'auto', maxHeight: '80vh'}}>
                {generatedProducts.map((genProductObj: GeneratedProduct) => {
                    const {productId, status, granuleId, parametersUsedToGenerate, downloadUrl} = genProductObj
                    const {batchGenerateProductParameters, utmZoneAdjust, mgrsBandAdjust} = parametersUsedToGenerate
                    return(
                        <Accordion.Item eventKey={genProductObj.productId}>
                                <Accordion.Header>
                                <Col>
                                    {/* <Badge pill bg={getBadgeColor(status)} style={{ width: '170px', height: '20px'}}>
                                        {getBadgeLabel(status)}
                                    </Badge> */}
                                    {`Granule ID: ${granuleId}`}
                                    </Col>
                                    {/* <Col>
                                        {`Product ID: ${productId}`}
                                    </Col> */}
                                    <Col>
                                    {downloadUrl ? `Download URL: ${(<a href={downloadUrl}>{downloadUrl}</a>)}` : null}
                                    </Col>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col>
                                            <Row><h6>Parameters Used to Generate Product</h6></Row>
                                            {Object.entries(batchGenerateProductParameters).map(entry => <Row><Col>{`${entry[0]}: ${entry[1]}`}</Col></Row>)}
                                            {batchGenerateProductParameters.outputSamplingGridType === 'utm' ? (
                                                <>
                                                    <Row><Col>{`utmZoneAdjust: ${utmZoneAdjust}`}</Col></Row>
                                                    <Row><Col>{`mgrsBandAdjust: ${mgrsBandAdjust}`}</Col></Row>
                                                </>
                                            ): null}
                                        </Col>
                                        <Col>
                                            <Row><h6>{status === 'COMPLETE' ? 'Download URL' : 'Product Generation Still in Progress'}</h6></Row>
                                            <Row>
                                                {status === 'COMPLETE' ? <a href={downloadUrl as string}>{downloadUrl}</a> : <Col><Spinner animation="border" /></Col>}
                                            </Row>
                                            {status === 'COMPLETE' ? (
                                                <Row>
                                                    <Col>
                                                    <OverlayTrigger
                                                            placement="right"
                                                            overlay={
                                                                <Tooltip id="button-tooltip">{copyTooltipText}</Tooltip>
                                                            }
                                                        >
                                                            <Button style={{backgroundColor: 'transparent', borderColor: 'white', color: 'black'}} onClick={() => {handleCopyClick(downloadUrl as string)}} onMouseLeave={() => setCopyTooltipText('Click to Copy URL')}><Clipboard/></Button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                    <Col>
                                                    <Button style={{backgroundColor: 'transparent', borderColor: 'white', color: 'black'}}><Download/></Button>
                                                    </Col>
                                                </Row>
                                            ) : null
                                            }

                                        </Col>
                                    </Row>
                                </Accordion.Body>
                        </Accordion.Item>
                    )}
                )}
            </Accordion>
        </Col>
    )
    

    const productHistoryAlert = () => {
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => dispatch(setCurrentPage('productCustomization'))} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const renderProductHistoryViews = () => {
        let viewToShow
        if (generatedProducts.length === 0) {
            viewToShow = productHistoryAlert()
        } else {
            viewToShow = renderHistoryContents
        } 

        return (
            <Row className='normal-row'>
                <h3>Generated Product History</h3>
                {viewToShow}
            </Row>
        )
    }

    return (
        <Row>
            {renderProductHistoryViews()}
        </Row>
    );
}

export default GeneratedProductHistory;