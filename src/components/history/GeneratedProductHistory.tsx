import { Alert, Col, OverlayTrigger, Row, Table, Tooltip, Button } from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";
import { getUserProductsResponse, Product } from "../../types/graphqlTypes";
import { useEffect, useState } from "react";
import { InfoCircle, Clipboard, Download } from "react-bootstrap-icons";
import { generatedProductsLabels, infoIconsToRender, parameterHelp } from "../../constants/rasterParameterConstants";
import { getUserProducts } from "../../user/userData";
import { useLocation, useNavigate } from "react-router-dom";

const GeneratedProductHistory = () => {
    // const generatedProducts = useAppSelector((state) => state.product.generatedProducts)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const { search } = useLocation();
    const navigate = useNavigate()
    const [userProducts, setUserProducts] = useState<Product[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            const userProductsResponse: getUserProductsResponse = await getUserProducts()
            if (userProductsResponse.status === 'success') setUserProducts(userProductsResponse.products as Product[])
        }
        fetchData()
        .catch(console.error);
      }, []);

    // TODO: implement download link copy button
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
    
      const renderColTitle = (labelEntry: string[], index: number) => {
        let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
        let labelId = (labelEntry[0] === 'downloadUrl') ? 'download-url' : ''
        return (
          <th key={`${labelEntry[0]}-${index}`} id={labelId}>{labelEntry[1]} {infoIcon}</th>
        )
      }

    const renderHistoryTable = () => {
        return (
            <div style={{padding: '0px 20px 20px 20px'}} id='history-table'>
                <div className={`table-responsive-generatedProducts table-responsive`}>
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        {Object.entries(generatedProductsLabels).map((labelEntry, index) => renderColTitle(labelEntry, index))}
                    </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((generatedProductObject, index) => {
                            const {status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                            const statusToUse = status[0].state
                            // const downloadUrl = granules && granules.length !== 0 ? <a href={granules[0].uri} target="_blank" rel="noreferrer">{granules[0].uri.split('/').pop()}</a> : 'N/A'
                            const downloadUrl = granules && granules.length !== 0 ? granules[0].uri.split('/').pop() : 'N/A'
                            const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                            const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                            const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                            const outputGranuleExtentFlagToUse = outputGranuleExtentFlag ? '256 x 128 km' : '128 x 128 km'
                            const productRowValues = {cycle, pass, scene, status: statusToUse, outputGranuleExtentFlag: outputGranuleExtentFlagToUse, outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, downloadUrl, dateGenerated}
                            return (
                            <tr className={`${colorModeClass}-table hoverable-row`} key={`generated-products-data-row-${index}`}>
                            {Object.entries(productRowValues).map((entry, index2) => {
                                let iconToRight = null
                                if (entry[0] === 'downloadUrl' && entry[1] !== 'N/A') {
                                    const downloadUrlString = granules[0].uri
                                    iconToRight = 
                                    <Row>
                                        <Col><Button onClick={() => handleCopyClick(downloadUrlString as string)}><Clipboard color="white" size={18}/></Button></Col>
                                        <Col><Button onClick={() => window.open(downloadUrlString, '_blank', 'noreferrer')}><Download color="white" size={18}/></Button></Col>
                                    </Row>
                                }
                                return <td style={{}} key={`${index}-${index2}`}>{entry[1]}{iconToRight}</td>
                            } )}
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
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => navigate(`/generatedProductHistory${search}`)} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const renderProductHistoryViews = () => {
        let viewToShow
        // if (userProducts.length === 0) {
        //     viewToShow = productHistoryAlert()
        // } else {
        //     viewToShow = renderHistoryTable()
        // } 
        return (
            <Col style={{marginRight: '50px', marginLeft: '50px', marginTop: '70px', height: '100%', width: '100%'}}>
                <Row className='normal-row' style={{marginRight: '0px'}}><h4>Generated Products Data</h4></Row>
                <Row className='normal-row' style={{marginRight: '0px'}}>{renderHistoryTable()}</Row>
                {userProducts.length === 0 ? <Row className='normal-row' style={{marginRight: '0px'}}>{productHistoryAlert()}</Row> : null}
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