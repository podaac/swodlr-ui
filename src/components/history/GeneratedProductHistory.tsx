import { Alert, Col, OverlayTrigger, Row, Table, Tooltip, Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserProductsResponse, Product } from "../../types/graphqlTypes";
import { useEffect, useState } from "react";
import { InfoCircle, Clipboard, Download } from "react-bootstrap-icons";
import { generatedProductsLabels, infoIconsToRender, parameterHelp, productsPerPage } from "../../constants/rasterParameterConstants";
import { getUserProducts } from "../../user/userData";
import { useLocation, useNavigate } from "react-router-dom";
import DataPagination from "./DataPagination";
import { setFirstHistoryPageData, setHistoryPageStateNext, setUserProducts } from "../sidebar/actions/productSlice";

const GeneratedProductHistory = () => {
    const dispatch = useAppDispatch()
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const { search } = useLocation();
    const navigate = useNavigate()
    // const [userProducts, setUserProducts] = useState<Product[]>([])
    const [waitingForProductsToLoad, setWaitingForProductsToLoad] = useState(true)
    
    useEffect(() => {
        const fetchData = async () => {
            await getUserProducts({limit: productsPerPage}).then((response) => {
                setWaitingForProductsToLoad(false)
                if (response.status === 'success'){
                    const productResults = response.products as Product[]
                    dispatch(setHistoryPageStateNext(productResults[productResults.length-1].id))
                    dispatch(setFirstHistoryPageData(productResults))
                    dispatch(setUserProducts(productResults))
                }
            })
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

    const renderCopyDownloadButton = (downloadUrlString: string) => (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="button-tooltip">
                    Copy
                </Tooltip>
            }
        >
            <Button onClick={() => handleCopyClick(downloadUrlString as string)}><Clipboard color="white" size={18}/></Button>
        </OverlayTrigger>
    )

    const renderDownloadButton = (downloadUrlString: string) => (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="button-tooltip">
                    Download
                </Tooltip>
            }
        >
            <Button onClick={() => window.open(downloadUrlString, '_blank', 'noreferrer')}><Download color="white" size={18}/></Button>
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
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0'}}>
                        <thead>
                        <tr>
                            {Object.entries(generatedProductsLabels).map((labelEntry, index) => renderColTitle(labelEntry, index))}
                        </tr>
                        </thead>
                        <tbody>
                            {userProducts.map((generatedProductObject, index) => {
                                const {status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                                const statusToUse = status[0].state
                                const downloadUrl = granules && granules.length !== 0 ? granules[0].uri.split('/').pop() : 'N/A'
                                const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                                const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                                const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                                const outputGranuleExtentFlagToUse = outputGranuleExtentFlag ? '256 x 128 km' : '128 x 128 km'
                                const productRowValues = {cycle, pass, scene, status: statusToUse, outputGranuleExtentFlag: outputGranuleExtentFlagToUse, outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, downloadUrl, dateGenerated}
                                return (
                                <tr className={`${colorModeClass}-table hoverable-row`} key={`generated-products-data-row-${index}`}>
                                {Object.entries(productRowValues).map((entry, index2) => {
                                    let cellContents = null
                                    if (entry[0] === 'downloadUrl' && entry[1] !== 'N/A') {
                                        const downloadUrlString = granules[0].uri
                                        cellContents = 
                                        <Row className='normal-row'>
                                            <Col>{entry[1]}</Col>
                                            <Col>{(renderCopyDownloadButton(downloadUrlString))}</Col>
                                            <Col>{renderDownloadButton(downloadUrlString)}</Col>
                                        </Row>
                                    } else {
                                        cellContents = entry[1]
                                    }
                                    return <td style={{}} key={`${index}-${index2}`}>{cellContents}</td>
                                } )}
                                </tr>
                            )})}
                        </tbody>
                    </Table>
                </div>
                <DataPagination />
            </div>
        )
    }
    

    const productHistoryAlert = () => {
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => navigate(`/generatedProductHistory${search}`)} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const waitingForProductsToLoadSpinner = () => {
        return (
            <div>
                <h5>Loading Data Table...</h5>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const renderProductHistoryViews = () => {
        return (
            <Col>
                <Row>{renderHistoryTable()}</Row>
                {userProducts.length === 0 ? <Row>{productHistoryAlert()}</Row> : null}
            </Col>
        )
    }

    return (
        <>
        <h4 className='normal-row' style={{marginTop: '70px'}}>Generated Products Data</h4>
        <Col className='about-page' style={{marginRight: '50px', marginLeft: '50px'}}>
            <Row className='normal-row'>{waitingForProductsToLoad ? waitingForProductsToLoadSpinner() : renderProductHistoryViews()}</Row>
        </Col>
        </>
    );
}

export default GeneratedProductHistory;