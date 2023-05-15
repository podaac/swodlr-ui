import { Accordion, Alert, Badge, Button, Col, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { StatusTypes } from "../../types/constantTypes";
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

    const renderListContents = (
        <Col style={{marginLeft: '20px', marginRight: '20px', marginBottom: '20px', height: '80vh'}}>
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
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => dispatch(setCurrentPage('productCustomization'))} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const renderProductHistoryViews = () => {
        let viewToShow
        if (generatedProducts.length === 0) {
            viewToShow = productHistoryAlert()
        } else {
            viewToShow = renderListContents
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