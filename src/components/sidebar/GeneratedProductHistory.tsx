import { Accordion, Alert, Badge, Button, Card, Col, ListGroup, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GenerateProductParameters, StatusTypes } from "../../types/constantTypes";
import { useState } from "react";
import { Download, Clipboard, ChevronDown } from "react-bootstrap-icons";
import { setActiveTab } from "./actions/sidebarSlice";

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
    const addedGranules = useAppSelector((state) => state.product.addedProducts)
    // const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const dispatch = useAppDispatch()
    
    const [viewType, setViewType] = useState('list')
    const [copyTooltipText, setCopyTooltipText] = useState('Click to Copy URL')

    const handleCopyClick = (downloadUrl: string) => {
        navigator.clipboard.writeText(downloadUrl)
        setCopyTooltipText('Copied!')
    }
    
    // const renderCardContents = generatedProducts.map(genProductObj => (
    //     <Col style={{margin: '10px'}}>
    //         <Card className={`${colorModeClass}-text`} style={{ width: '18rem' }}>
    //             <Card.Header className={`${colorModeClass}-text`} style={{color: 'black'}}>{granuleId}</Card.Header>
    //             <Card.Title className={`${colorModeClass}-text`} style={{color: 'black'}}>{genProductObj.productId}</Card.Title>
    //             <Card.Text className={`${colorModeClass}-text`} style={{color: 'black'}}>
    //                 Parameters Used to Generate
    //             </Card.Text>
    //             <Card.Header  style={{color: 'black'}}> Parameters Used to Generate</Card.Header>
    //             <ListGroup>
    //                 {Object.entries(genProductObj.parametersUsedToGenerate).map(entry => <ListGroup.Item>{`${entry[0]}: ${entry[1]}`}</ListGroup.Item>)}
    //             </ListGroup>
    //             <Badge pill bg={getBadgeColor(genProductObj.status)} style={{margin: '20px', width: '100px', height: '50px'}}>
    //                 {getBadgeLabel(genProductObj.status)}
    //             </Badge>
    //             <Row>
    //                 <Col><Download style={{color: 'black'}}/></Col>
    //                 <Col><ChevronDown style={{color: 'black'}}/></Col>
    //             </Row>
    //         </Card>
    //     </Col>
    // ))

    const renderListContents = (
        <Col style={{marginLeft: '20px', marginRight: '20px', marginBottom: '20px'}}>
            <Row style={{marginBottom: '10px'}}>
                <h4>Generated Product History</h4>
            </Row>
            <Accordion className="shadow" style={{overflowY: 'auto', maxHeight: '80vh'}}>
                {generatedProducts.map(genProductObj => (
                    <Accordion.Item eventKey={genProductObj.productId}>
                            <Accordion.Header>
                            <Col>
                                    <Badge pill bg={getBadgeColor(genProductObj.status)} style={{ width: '170px', height: '20px'}}>
                                        {getBadgeLabel(genProductObj.status)}
                                    </Badge>
                                </Col>
                                <Col>
                                    {`Product ID: ${genProductObj.productId}`}
                                </Col>

                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>
                                        <Row><h6>Parameters Used to Generate Product</h6></Row>
                                        {Object.entries(genProductObj.parametersUsedToGenerate).map(entry => <Row><Col>{`${entry[0]}: ${entry[1]}`}</Col></Row>)}
                                    </Col>
                                    <Col>
                                        <Row><h6>{genProductObj.status === 'COMPLETE' ? 'Download URL' : 'Product Generation Still in Progress'}</h6></Row>
                                        <Row>
                                            {genProductObj.status === 'COMPLETE' ? <a href={genProductObj.downloadUrl as string}>{genProductObj.downloadUrl}</a> : <Col><Spinner animation="border" /></Col>}
                                        </Row>
                                        {genProductObj.status === 'COMPLETE' ? (
                                            <Row>
                                                <Col>
                                                <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip id="button-tooltip">{copyTooltipText}</Tooltip>
                                                        }
                                                    >
                                                        <Button style={{backgroundColor: 'transparent', borderColor: 'white', color: 'black'}} onClick={() => {handleCopyClick(genProductObj.downloadUrl as string)}} onMouseLeave={() => setCopyTooltipText('Click to Copy URL')}><Clipboard/></Button>
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
                ))}
            </Accordion>
        </Col>
    )

    const productHistoryAlert = () => {
        let alertMessage = ''
        if (addedGranules.length === 0) {
            alertMessage = 'No granules have been added. Go to the (1) Granule Selection tab to add granules for product customization.'
        } else {
            alertMessage = 'No products have been generated. Go to the (2) Product Customization tab to generate products.'
        }
        return <Col><Alert variant='warning' onClick={() => dispatch(setActiveTab('productCustomization'))} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const renderProductHistoryViews = () => {
        if (generatedProducts.length === 0) {
            return productHistoryAlert()
        } else if (viewType === 'list') {
            return renderListContents
        } 
        // else if (viewType === 'grid') {
        //     return renderCardContents
        // }
    }

    return (
        <Row>
            {renderProductHistoryViews()}
        </Row>
    );
}

export default GeneratedProductHistory;