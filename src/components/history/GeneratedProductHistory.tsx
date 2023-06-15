import { Accordion, Alert, Badge, Button, Card, Col, ListGroup, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GeneratedProduct, StatusTypes } from "../../types/constantTypes";
import { useState } from "react";
import { Download, Clipboard, InfoCircle } from "react-bootstrap-icons";
import { setCurrentPage } from "../app/appSlice";
import { generatedProductsLabels, infoIconsToRender, parameterHelp } from "../../constants/rasterParameterConstants";

const GeneratedProductHistory = () => {
    const generatedProducts = useAppSelector((state) => state.product.generatedProducts)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const dispatch = useAppDispatch()
    
    const [copyTooltipText, setCopyTooltipText] = useState('Click to Copy URL')

    const handleCopyClick = (downloadUrl: string) => {
        navigator.clipboard.writeText(downloadUrl)
        setCopyTooltipText('Copied!')
    }

    const renderInfoIcon = (parameterId: string) => (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="button-tooltip">
                {parameterHelp[parameterId]}
              </Tooltip>
            }
        >
           <InfoCircle/>
        </OverlayTrigger>
    )
    
      const renderColTitle = (labelEntry: string[]) => {
        let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
        return (
          <th>{labelEntry[1]} {infoIcon}</th>
        )
      }

    const renderHistoryTable = () => {
        return (
            <div style={{padding: '10px 20px 20px 20px'}}>
                <div className={`table-responsive-generatedProducts`}>
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        {Object.entries(generatedProductsLabels).map(labelEntry => renderColTitle(labelEntry))}
                    </tr>
                    </thead>
                    <tbody>
                    {generatedProducts.map((generatedProductObject, index) => {
                        const {productId, status, granuleId, parametersUsedToGenerate, downloadUrl, dateGenerated, cycle, pass, scene} = generatedProductObject
                        const {batchGenerateProductParameters, utmZoneAdjust, mgrsBandAdjust} = parametersUsedToGenerate
                        const {outputGranuleExtentFlag, outputSamplingGridType, rasterResolution} = batchGenerateProductParameters
                        const dateToShow = dateGenerated?.toUTCString()
                        const productRowValues = {productId, granuleId, status, cycle, pass, scene, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjust, mgrsBandAdjust, downloadUrl, dateToShow}
                        return (
                        <tr className={`${colorModeClass}-table hoverable-row`}>
                        {Object.entries(productRowValues).map(entry => <td>{entry[1]}</td> )}
                        </tr>
                    )})}
                    </tbody>
                </Table>
            </div>
          </div>
        )
    }
    

    const productHistoryAlert = () => {
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => dispatch(setCurrentPage('productCustomization'))} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const renderProductHistoryViews = () => {
        let viewToShow
        if (generatedProducts.length === 0) {
            viewToShow = productHistoryAlert()
        } else {
            viewToShow = renderHistoryTable()
        } 

        return (
            <Col>
                <Row className='normal-row' style={{marginRight: '0px'}}><h2>Generated Products Data</h2></Row>
                <Row className='normal-row' style={{marginRight: '0px'}}>{viewToShow}</Row>
            </Col>
        )
    }

    return (
        <Row>
            {renderProductHistoryViews()}
        </Row>
    );
}

export default GeneratedProductHistory;