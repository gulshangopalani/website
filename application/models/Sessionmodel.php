<?php
defined('BASEPATH') OR exit('No direct script access allowed');

	class Sessionmodel extends CI_Model{		
		
		function getFancyData($matchId,$fancyId){
			$this->db->select("TypeID,ID,SessInptYes,SessInptNo,active,MFancyID as FncyId,MaxStake,NoValume,YesValume,pointDiff,rateDiff,DisplayMsg,RateChange");
			$this->db->from('matchfancy');
			$this->db->where('MatchID',$matchId);
			$this->db->where('ID',$fancyId);
			$query = $this->db->get();
			return $query->result_array();	
		}
		function GetBetData($matchId,$fancyId,$userId,$usertype){
			$query =$this->db->query("call SP_GetFancy($userId,$usertype,$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
		}
		function getFancyBetList($matchId,$fancyId,$userId,$usertype){
			$query =$this->db->query("call SP_GetFancy($userId,$usertype,$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
		}
		function scorePosition($userId,$fancyId,$typeId){
			//echo "call sp_GetScorePosition($userId,$fancyId,$typeId)";	die();		
			$query =$this->db->query("call sp_GetScorePosition($userId,$fancyId,$typeId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);die();					
			return $res;
		}
		function GetSumOfBet($userId,$matchId,$FancyId,$fancyType,$yes,$no){
			//echo "call sp_getSumSessBetYesNo($userId,$matchId,$FancyId,$fancyType,$yes,$no)";
			$query =$this->db->query("call sp_getSumSessBetYesNo($userId,$matchId,$FancyId,$fancyType,$yes,$no)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();					
			return $res;
		}
		function DisableAllFancy($MatchID){
			$data=array('active'=>0);
			$this->db->where('MatchID',$MatchID);
			$this->db->where('active !=',2);
			$this->db->where('result',NULL);
			$this->db->update('matchfancy',$data);

		}
		

	}