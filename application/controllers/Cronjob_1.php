<?php
defined('BASEPATH') OR exit('No direct script access allowed');
error_reporting(1);
ini_set('error_reporting', E_ALL);
class Cronjob extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $_POST = json_decode(file_get_contents('php://input'), true);
        $this->load->model('Cronjobmodel');
        echo "\n" . date('Y-m-d H:i:s', now()) . "\n";
    }

    function getMatchLst()
    {
        try {

            $rawdata = $this->Cronjobmodel->getSeriesLst(0);

            foreach ($rawdata as $row) {
                $data['matchLst'] = $this->Cronjobmodel->getMatchLstData($row['SportID'], $row['seriesId']);
                if (sizeof($data['matchLst']) > 0) {
                    foreach ($data['matchLst'] as $d) {

                        $curl = curl_init();

                        curl_setopt_array($curl, array(
                            CURLOPT_URL => "http://test.techzilla.in/metadoorodds/?eventType=" . $d['SportID'] . "&eventId=" . $d['MstCode'],
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_ENCODING => "",
                            CURLOPT_MAXREDIRS => 10,
                            CURLOPT_TIMEOUT => 30,
                            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                            CURLOPT_CUSTOMREQUEST => "GET",
                            CURLOPT_HTTPHEADER => array(
                                "Cache-Control: no-cache"
                            ),
                        ));

                        $res = json_decode(curl_exec($curl), true);
                        curl_close($curl);
                        if (isset($res)) {

                            $result = $res["result"];

                            $dateToSend = date('Y-m-d');
                            $timeToSend = date('H:i:s');

                            if (sizeof($result) > 0) {
                                foreach ($result as $r) {
                                    $obj = array();
                                    if (!empty($r))
                                        if ($r['provider'] == "FANCY") {
                                            $obj['name'] = $r['name'];
                                            $obj['remarks'] = '';
                                            $obj['mid'] = $d['MstCode'];
                                            $obj['date'] = $dateToSend;
                                            $obj['time'] = $timeToSend;
                                            $obj['fancyType'] = 2;
                                            $obj['inputYes'] = $r['runners'][0]['back'][0]['line'];
                                            $obj['inputNo'] = $r['runners'][0]['lay'][0]['line'];
                                            $obj['sid'] = $d['SportID'];
                                            $obj['RateDiff'] = abs($r['runners'][0]['back'][0]['line'] - $r['runners'][0]['lay'][0]['line']);
                                            $obj['PointDiff'] = 1;
                                            $obj['MaxStake'] = 100000;
                                            $obj['NoLayRange'] = $r['runners'][0]['lay'][0]['price'];
                                            $obj['YesLayRange'] = $r['runners'][0]['back'][0]['price'];
                                            $obj['marketId'] = $r['id'];
                                            if ($r['status'] == 'OPEN') {
                                                if ($r['statusLabel'] == 'Ball Running') {
                                                    $obj['active'] = 0;
                                                } else {
                                                    $obj['active'] = 1;
                                                }
                                            } else {
                                                $obj['active'] = 2;
                                            }

                                            $boolValue = $this->getDatamatchfancy($r['id']);

                                            if ($boolValue['success']) {
                                                //Exist in Api not in DB
                                                echo "S_fancy\n";
                                                $savedData = $this->Cronjobmodel->saveFancy($obj);
                                                print_r($savedData);
                                            } else {
                                                echo "U_fancy\n";
                                                //Exist in Api, Also in DB
                                                $fancyDB = $this->Cronjobmodel->getFancy($obj['marketId']);
                                                if ($fancyDB['autoActive'] == 1) {
                                                    $obj['active'] = 2;
                                                }
                                                $this->updatefancy($obj);
                                            }


                                            $curl = curl_init();
                                            $input = array(
                                                CURLOPT_PORT => "8080",
                                                CURLOPT_URL => "http://35.178.141.181:8080/api/marketId",
                                                CURLOPT_RETURNTRANSFER => true,
                                                CURLOPT_ENCODING => "",
                                                CURLOPT_MAXREDIRS => 10,
                                                CURLOPT_TIMEOUT => 30,
                                                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                                                CURLOPT_CUSTOMREQUEST => "POST",
                                                CURLOPT_POSTFIELDS => "{\n\"marketId\":\"" . $obj['marketId'] . "\",
                                                \n\"results\":\"\",
                                                \n\"fancyName\":\"" . $r['name'] . "\",
                                                \n\"matchName\":\"" . $r['event']['name'] . "\",
                                                \n\"HeadName\":\"" . $r['competition']['name'] . "\",
                                                \n\"date\":\"" . $r['event']['openDate'] . "\",
                                                \n\"time\":\"" . $r['event']['openDate'] . "\",
                                                \n\"serId\":\"" . $r['competition']['id'] . "\",
                                                \n\"matchId\":\"" . $r['event']['id'] . "\",
                                                \n\"SprtId\":\"" . $r['eventTypeId'] . "\"}",
                                                CURLOPT_HTTPHEADER => array(
                                                    "Cache-Control: no-cache",
                                                    "Content-Type: application/json",
                                                ),
                                            );
                                            curl_setopt($curl, CURLOPT_VERBOSE, 0);
                                            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                                            curl_setopt_array($curl, $input);
                                            $response = json_decode(curl_exec($curl), true);
                                            $err = curl_error($curl);
                                            curl_close($curl);
                                            $res = $response;
                                            echo "=======>  RESPONSE";
                                            print_r($res);
                                            if ($res['exists'] == "true") {
                                                echo " 1 exists == true";
                                                $this->updateFancyResult($obj['marketId'], $res['results']);
                                            } else {
                                                echo " 1 exists == false";
                                            }
                                        };
                                }
                            }
                            //All fancy from Database
                            $fancyFrmResult = $this->Cronjobmodel->getFancyFromDB($d['MstCode']);

                            $count = array(
                                'count' => 0
                            );
                            foreach ($fancyFrmResult as $item) {
                                $isInApi = array(
                                    'bool' => false
                                );
                                foreach ($result as $res) {
                                    if (!empty($res) && $res['provider'] == "FANCY") {
                                        //Exist in DB but not in APi
                                        if ($res['id'] == $item['marketId']) {
                                            echo 'match found in DB here ' . $item['marketId'] . "  " . $res['id'] . "\n";
                                            $isInApi['bool'] = true;
                                            $count['count']++;
                                        }
                                    }
                                }

                                if (!$isInApi['bool'] && $item['marketId']!=null) {
                                    echo "\n";
                                    echo "Setting inactive for " . $item['marketId'] . "\n";


//                                    $curl = curl_init();
//
//                                    curl_setopt_array($curl, array(
//                                        CURLOPT_URL => "http://35.178.141.181/nikhilgalaxy/Lstsavemstrcontroller/updateFancyHeaderSatatus/",
//                                        CURLOPT_RETURNTRANSFER => true,
//                                        CURLOPT_ENCODING => "",
//                                        CURLOPT_MAXREDIRS => 10,
//                                        CURLOPT_TIMEOUT => 30,
//                                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//                                        CURLOPT_CUSTOMREQUEST => "POST",
//                                        CURLOPT_POSTFIELDS => "id=6404&active=2&HelperID=0&autoActive=0",
//                                        CURLOPT_HTTPHEADER => array(
//                                            "Cache-Control: no-cache",
//                                            "Content-Type: application/x-www-form-urlencoded",
//                                        ),
//                                    ));
//
//                                    $response = curl_exec($curl);
//                                    $err = curl_error($curl);
//
//                                    curl_close($curl);
//                                    echo $response;


                                    $inactive = array();
                                    $inactive['inputYes'] = $item['SessInptYes'];
                                    $inactive['inputNo'] = $item['SessInptNo'];
                                    $inactive['NoLayRange'] = $item['NoValume'];
                                    $inactive['YesLayRange'] = $item['YesValume'];
                                    $inactive['RateDiff'] = $item['rateDiff'];
                                    $inactive['marketId'] = $item['marketId'];
                                    $inactive['active'] = 2;
                                    $affected_row = $this->updatefancy($inactive);
//                                    $affected_row = $this->Cronjobmodel->setInactive($item['ID']);
//                                    print_r($affected_row);

                                    echo "\n =======> affected row ";
                                    print_r($affected_row);
                                    echo "\n";
                                }
                                /**
                                 * Check for /marketResult with @item['marketId']
                                 *
                                 */
                                $curl = curl_init();
                                $input = array(
                                    CURLOPT_PORT => "8080",
                                    CURLOPT_URL => "http://35.178.141.181:8080/api/marketResult",
                                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                                    CURLOPT_CUSTOMREQUEST => "POST",
                                    CURLOPT_POSTFIELDS => "{\"marketId\":\"" . $item['marketId'] . "\"}",
                                    CURLOPT_HTTPHEADER => array(
                                        "Cache-Control: no-cache",
                                        "Content-Type: application/json",
                                    ),
                                );
                                curl_setopt($curl, CURLOPT_VERBOSE, 0);
                                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                                curl_setopt_array($curl, $input);
                                $response = json_decode(curl_exec($curl), true);
                                $res = $response;
                                curl_close($curl);
                                echo "\n entry exists out";
                                print_r($response);
                                if ($res['exists'] == "true") {
                                    echo "\n entry exists";
                                    $this->updateFancyResult($item['marketId'], $res['results']);
                                } else {

                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {

        }
        $fancyFrmResult = $this->Cronjobmodel->getFancyFromDB($d['MstCode']);
        print_r($fancyFrmResult);
        echo "\n" . date('Y-m-d H:i:s', now()) . "\n";
    }

    function getDatamatchfancy($market_id)
    {
        $data = $this->Cronjobmodel->getmatchfancyData($market_id);

        if ($data->num_rows() == 0) {
            echo "======>true\n";
            return (array('success' => true, 'data' => $data->result()));
        } else {
            echo "======>false\n";
            return (array('success' => false, 'data' => $data->result()));
        }
    }

    function updateFancyResult($marketId, $result)
    {
        $Dbres = $this->Cronjobmodel->getFancy($marketId);
//        echo "==========================================";
//        print_r($Dbres);
//        echo "==========================================";
        echo "\n updateFancyResult";
        if (!empty($result)) {
            echo "\nRESULT LEVEL 1";
            $data = $this->Cronjobmodel->getFancyResult($Dbres['ID']);
            if (!empty($data)) {
                echo "\nRESULT LEVEL 2";
                if ($data[0]->result != $result) {
                    echo "Exist result in PHP_MY_ADMIN";
                    $this->Cronjobmodel->DeleteMatchResult($data[0]->resId,
                        $data[0]->sportId,
                        $data[0]->matchId,
                        $marketId,
                        $data[0]->selectionId,
                        $data[0]->isFancy
                    );
                    $this->Cronjobmodel->updateFancyResult($Dbres['SprtId'], $Dbres['MatchID'], $Dbres['ID'], $result);
                }

            } else {
                echo "\nRESULT LEVEL 3";
                $this->Cronjobmodel->updateFancyResult($Dbres['SprtId'], $Dbres['MatchID'], $Dbres['ID'], $result);
            }
        }
    }

    function updatefancy($obj)
    {
        $SessInptNo = $obj['inputNo'];
        $SessInptYes = $obj['inputYes'];
        $NoValume = $obj['NoLayRange'];
        $YesValume = $obj['YesLayRange'];
        $rateDiff = $obj['RateDiff'];
        $marketID = $obj['marketId'];
        $active = $obj['active'];
        echo "Update fancy call";
        echo "\n=========================> sending active = " . $active . "\n";

        $condition = $this->Cronjobmodel->updatefancy2($SessInptNo, $SessInptYes, $NoValume, $YesValume, $rateDiff, $marketID, $active);
        return $condition;
    }
}