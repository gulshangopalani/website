<?php
defined('BASEPATH') OR exit('No direct script access allowed');
error_reporting(1);
ini_set('error_reporting', E_ALL);

/**
 * Check UserName and Password Of Login Page
 */
class Cronjobmodel extends CI_Model
{

    function __construct()
    {
        $_POST = json_decode(file_get_contents('php://input'), true);
    }

    function saveLogs($logs)
    {
        $insertLogData = array('Logs' => $logs,);
        $query = $this->db->insert('cronjoblogs', $insertLogData);
    }

    function getMatchLstData($sportId, $seriesId)
    {
        if ($sportId == 0) {
            $condition = "";
            $condition1 = "";
            $condition2 = "";
        } else {
            $condition = $this->db->where('SportID', $sportId);
            if ($seriesId != 0) $condition2 = $this->db->where('seriesId', $seriesId);
            $condition1 = $this->db->where('active', 1);
        }
        $this->db->select("mtchMst.volumeLimit,mtchMst.oddsLimit,mtchMst.matchName,mtchMst.countryCode,mtchMst.marketCount,mtchMst.MstDate,spmst.name,mtchMst.active,mtchMst.SportID,mtchMst.MstCode");
        $this->db->from('matchmst mtchMst');
        $this->db->join('sportmst spmst', 'mtchMst.SportID=spmst.id', 'INNER');
        $condition;
        $condition1;
        $condition2;
        $this->db->order_by("matchName asc");
        $query = $this->db->get();

        return $query->result_array();
    }

    function updatefancy2($SessInptNo, $SessInptYes, $NoValume, $YesValume, $rateDiff, $marketID, $active)
    {
        $data = array(
            'SessInptYes' => $SessInptYes,
            'SessInptNo' => $SessInptNo,
            'NoValume' => $NoValume,
            'YesValume' => $YesValume,
            'rateDiff' => $rateDiff,
            'updated_at' => date('Y-m-d H:i:s', now()),
            'active' => $active
        );
        $this->db->where('marketId', $marketID);
        $updatedFancy = $this->db->update('matchfancy', $data);
        $lastQuery = $this->db->last_query();
        return $updatedFancy;

    }

    function getMatchNameById($matchId)
    {
        $this->db->select("matchName");
        $this->db->from('matchmst');
        $this->db->where('MstCode', $matchId);
        $query = $this->db->get();
        return $query->result();

    }

    function saveFancy($obj){
        $row = $this->db->query('SELECT MAX(MFancyID) AS `maxid` FROM `matchfancy`')->row();
        $maxid = $row->maxid + 1;
        $insertData = array(
            'HeadName' => $obj['name'],
            'TypeID' => $obj['fancyType'],
            'MatchID' => $obj['mid'],
            'Remarks' => $obj['remarks'],
            'date' => $obj['date'],
            'time' => $obj['time'],
            'SessInptYes' => $obj['inputYes'],
            'SessInptNo' => $obj['inputNo'],
            'MFancyID' => $maxid,
            'SprtId' => $obj['sid'],
            'rateDiff' => $obj['RateDiff'],
            'pointDiff' => $obj['PointDiff'],
            'MaxStake' => $obj['MaxStake'],
            'NoValume' => $obj['NoLayRange'],
            'YesValume' => $obj['YesLayRange'],
            'marketId' => $obj['marketId'],
            'active' => $obj['active']
        );
        $this->db->trans_begin();
        $MatchName = $this->getMatchNameById($obj['mid']);
        $query = $this->db->insert('matchfancy', $insertData);
        $getQuery = $this->db->get_where('matchfancy', array('marketId' => $obj['marketId']));
        return $getQuery->result();

    }

    function getmatchfancyData($marketId)
    {
        return $this->db->get_where('matchfancy', array('marketId' => $marketId));
    }

    function getSeriesLst($matchId)
    {
        if ($matchId == 0) {
            $condition = "";
            $condition1 = "";
        } else {
            $condition = $this->db->where('SportID', $matchId);
            $condition1 = $this->db->where('active', 1);
        }

        $this->db->select("mtchMst.seriesId,mtchMst.Name,mtchMst.region,mtchMst.mCount,mtchMst.SportID,spmst.name as sportname,mtchMst.active");
        $this->db->from('seriesmst mtchMst');
        $this->db->join('sportmst spmst', 'mtchMst.SportID=spmst.id', 'INNER');
        $condition;
        $condition1;

        //$this->db->where('active', 1);
        $this->db->order_by("Name asc");
        $query = $this->db->get();

        return $query->result_array();
    }

    function updateFancyResult($sportId, $match_id, $fancy_Id, $result)
    {
        $query = $this->db->query("call SP_SetResult_Session($sportId,$match_id,$fancy_Id,$result)");
        $res = $query->result_array();
        $query->next_result();
        $query->free_result();
        return $res;
    }

    function getFancyFromDB($matchId)
    {
        return $this->db->get_where('matchfancy', array('MatchID' => $matchId))->result_array();
    }

    function getFancy($marketId)
    {
        return $this->db->get_where('matchfancy', array('marketId' => $marketId))->result_array()[0];
    }

    function getFancyFrmID($ID)
    {
        return $this->db->get_where('matchfancy', array('ID' => $ID))->result_array()[0];
    }

    function setInactive($Id)
    {
        try {
            $data = array(
                "active" => 2
            );

            $sql = "CALL sp_updateFancyStatus($Id)";
            echo $sql;
            $this->db->query($sql);
//            $this->db->where('ID', $Id);
//            $this->db->update('matchfancy', $data);

            return $this->getFancyFrmID($Id);
        } catch (Exception $e) {
            print_r($e);
            $data = array(
                "active" => 2
            );

            $this->db->where('ID', $Id);
            $this->db->update('matchfancy', $data);

            return $this->getFancyFrmID($Id);
        }
    }

    function DeleteMatchResult($resId, $sportId, $matchId, $marketId, $selectionId, $isFancy)
    {
        if ($isFancy == 1) {
            echo "call SP_DelResult($sportId,$matchId,$marketId ,$selectionId,$resId,$selectionId)";
            $query = $this->db->query("call SP_DelResult($sportId,$matchId,'$marketId',$selectionId,$resId,$selectionId)");
        } else {
            //echo "call SP_DelResult($sportId,$matchId,$marketId,$selectionId,$resId,0)";
            $query = $this->db->query("call SP_DelResult($sportId,$matchId,'$marketId',$selectionId,$resId,0)");
        }
        $res = $query->result_array();
        $query->next_result();
        $query->free_result();
        return $res;

    }

    function getFancyResult($id)
    {
        $query = $this->db->get_where('tblresult', array('selectionId' => $id))->result();
        return $query;
    }

}