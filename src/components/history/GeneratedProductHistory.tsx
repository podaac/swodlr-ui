import { Accordion, Alert, Badge, Button, Card, Col, ListGroup, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GeneratedProduct, StatusTypes, getUserProductsResponse } from "../../types/constantTypes";
import { useEffect, useState } from "react";
import { Download, Clipboard, InfoCircle } from "react-bootstrap-icons";
import { setCurrentPage } from "../app/appSlice";
import { generatedProductsLabels, infoIconsToRender, parameterHelp } from "../../constants/rasterParameterConstants";
import { Product } from "../../types/graphqlTypes";
import { getUserProducts } from "../../user/userData";

const GeneratedProductHistory = () => {
    // const generatedProducts = useAppSelector((state) => state.product.generatedProducts)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const dispatch = useAppDispatch()
    const [userProducts, setUserProducts] = useState<Product[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            const userProductsResponse: getUserProductsResponse = await getUserProducts()
            if (userProductsResponse.status === 'success') setUserProducts(userProductsResponse.products as Product[])
        }
        fetchData()
        .catch(console.error);
      }, []);

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
            <div style={{padding: '0px 20px 20px 20px'}}>
                <div className={`table-responsive-generatedProducts`}>
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        {Object.entries(generatedProductsLabels).map(labelEntry => renderColTitle(labelEntry))}
                    </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((generatedProductObject, index) => {
                            const {id: productId, status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                            const statusToUse = status[0].state
                            const sampleGranuleId = granules.length === 0 ? 'N/A' : granules[0].id
                            const sampleDownloadUrl = 'N/A'  
                            const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                            const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                            const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                            const productRowValues = {productId, sampleGranuleId, status: statusToUse, cycle, pass, scene, outputGranuleExtentFlag: outputGranuleExtentFlag.toString(), outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, sampleDownloadUrl, dateGenerated}
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
        if (userProducts.length === 0) {
            viewToShow = productHistoryAlert()
        } else {
            viewToShow = renderHistoryTable()
        } 

        return (
            <Col style={{marginRight: '50px', marginLeft: '50px', marginTop: '70px', height: '100%', width: '100%'}}>
                <Row className='normal-row' style={{marginRight: '0px'}}><h4>Generated Products Data</h4></Row>
                <Row className='normal-row' style={{marginRight: '0px'}}>{viewToShow}</Row>
            </Col>
        )
    }

    return (
        <Row className='about-page' style={{marginRight: '0%'}}>
            {renderProductHistoryViews()}
        </Row>
    );
}

export default GeneratedProductHistory;