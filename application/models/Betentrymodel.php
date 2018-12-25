<?php
defined('BASEPATH') OR exit('No direct script access allowed');
error_reporting("ERROR");
/**
* Check UserName and Password Of Login Page
*/
class Betentrymodel extends CI_Model
{
	function __construct()
	{
		$_POST = json_decode(file_get_contents('php://input'), true);
	}
	function Save_bet(){ 
			if ($this->input->post('UserTypeId')==3) {
				$GetpId=$this->Get_ParantId($this->input->post('loginId'));
				$ParantId=$GetpId[0]->parentId;
				$UserId=$this->input->post('loginId');
			}else{
				$ParantId=$this->input->post('ParantId');
				$UserId=$this->input->post('userId');
			}
		 	$insertbet = array(
				            'MstDate' 		=> date('Y-m-d H:i:s',now()),
				            'LogInId' 		=> $this->input->post('loginId'),
				            'UserId' 		=> $UserId,
				            'ParantId' 		=> $ParantId,
				            'MatchId' 		=> $this->input->post('matchId'),
				            'MarketId' 		=> $this->input->post('MarketId'),
				            'SelectionId' 	=> $this->input->post('selectionId'), 
							'Odds' 			=> $this->input->post('priceVal'),
							'P_L' 			=> $this->input->post('p_l'),
							'isBack' 		=> $this->input->post('isback'),
							'Stack'			=> $this->input->post('stake'),
							'IsMatched' 	=> $this->input->post('isMatched'),
							'selectionName' => $this->input->post('placeName'),
							'IP_ADDESSS' 	=> $_SERVER['REMOTE_ADDR'],
							'deviceInfo' 	=> $this->input->post('deviceInfo')
				        );
		 			$stake= $this->input->post('stake');
		 			$inplay= $this->input->post('inplay');
		 			if($inplay==true){
		 				$InplayVal=0; //Inplay
		 			}else{
		 				$InplayVal=1; //Going Inplay 
		 			}
					$stateMent='Chips Deducted From Betting >>'.$_POST['MatchName'];	
					$parameter=$this->input->post('loginId').','.$UserId.','.$ParantId.','.$this->input->post('matchId').','.$this->input->post('selectionId').','.$this->input->post('stake').',"'.$this->input->post('MarketId').'","'.$this->input->post('placeName').'","'.date('Y-m-d H:i:s',now()).'",'.$this->input->post('priceVal').','.$this->input->post('p_l').','.$this->input->post('isback').','.$this->input->post('isMatched').',"'.$stateMent.'","'.$this->input->post('deviceInfo').'","'.$_SERVER['REMOTE_ADDR'].'",'.$InplayVal.','.$this->input->post('ApiVal');
					//echo "call sp_PlaceBet($parameter)";
					/*START pROCEDURE CALL*/
						$query =$this->db->query("call sp_PlaceBet($parameter)");
						$res = $query->result_array();
						$query->next_result();
						$query->free_result();
						//print_r($query);
						//echo $this->db->queries[0];
						return $res;
					/*END OF PROCEDURE CALL*/

					

					//Add Userworking sourabh 170117
		//$creFancyId=$this->db->insert_id();
		////start user working table save the data By Manish 170117
		//$wortype="OddEven fancy";
		//$remarks="Fancy Type>>".$_POST['fancyType'].">>Fancy Name >>".$_POST['HeadName'].">> Match ID >>".$_POST['mid'];
		//$userWrkingArray = array(
		//	'woruser'=> $_POST['HeadName'],
		//	'wormode'=> 0,
		//	'wordate'=> $_POST['date'],
		//	'wortype'=> $wortype,
		//	'worcode'=> $creFancyId,
		//	'worsysn'=> $_SERVER['REMOTE_ADDR'],
		//	'worrema'=> $remarks,
		//	'worcudt'=> date('Y-m-d H:i:s',now()),
		//);
		//$condition=$this->db->insert('userworkin', $userWrkingArray);
		////End of useworking table

					return true;
	}
	function sumOfOdds($MarketId,$userId,$userType,$matchId)//170201_1
	{
		if($userId==null)$userId1=0;else $userId1=$userId;
		
			//$query =$this->db->query("call SP_OddsProfitLoss($userId1,$MarketId)");//sourabh 11-dec-2016
			$query =$this->db->query("call SP_OddsProfitLossNew($userId1,$userType,$matchId,$MarketId)");//sourabh 170201_1
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function getBetEntry($marketId,$UserTypeId,$userId,$matchId)
	{
			
			if ($userId==null) {
				$userId1=$_POST['userId'];
			}
			else{
				$userId1=$userId;
			}
			$query =$this->db->query("call SP_GetBetting($userId1,$UserTypeId,$marketId,$matchId)");//170131
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
				
			return $res;
	}
	function CheckAdminPass(){			
			$password=$_POST['Password'];
			$query =$this->db->query("call SP_CheckBetPass($password)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
				
			return $res;
	}
	function updateUnMatchedData($userId,$BackLay){
			$dataArray = array('IsMatched' => 1);
    		$this->db->where('MstCode',$userId);
            $this->db->update('tblbets', $dataArray);
            //echo $this->db->queries[0];die();		
            return true; 
	}

	function UpdatepointVal($pointVal){
			$dataArray = array('value' => $pointVal);
    		$this->db->where('Id',1);
            $this->db->update('detect_amount', $dataArray);
            //echo $this->db->queries[0];die();		
            return true; 
	}
	function UpdateBetDelay($betdelay){
			$dataArray = array('set_timeout' => $betdelay);
    		$this->db->where('usetype',3);
            $this->db->update('createmaster', $dataArray);
            //echo $this->db->queries[0];die();		
            return true; 
	}
	function PointValue($userId){
			/*$this->db->select("value");
			$this->db->from('detect_amount');
			$this->db->where('Id',1);
			$query = $this->db->get();
			return $query->result();*/
			$this->db->select("value");
			$this->db->from('detect_amount');
			$this->db->where('user_id',$userId);
			$query = $this->db->get();
			$rowcount = $query->num_rows();
			if($rowcount==0){
				return $query->result();
			}else{
				return $query->result();
			}
	}
	function GetMasterList(){
			$this->db->select("*");
			$this->db->from('createmaster');
			$this->db->where('usetype',1);
			$query = $this->db->get();
			return $query->result();
	}
	function chkbets(){
			$this->db->select("(select max(bet_id) as maxFancyId from bet_entry) as FbetId,(select max(MstCode) as maxOddsId from tblbets) as oddsbetId");
			/*$this->db->from('createmaster');
			$this->db->where('usetype',1);*/
			$query = $this->db->get();
			return $query->result();
	}
	
	function GetDealer($masterId){
			$this->db->select("*");
			$this->db->from('createmaster');
			$this->db->where('parentId',$masterId);
			$query = $this->db->get();
			return $query->result();
	}

	function Get_ParantId($userId){
			$this->db->select("parentId");
			$this->db->from('createmaster');
			$this->db->where('mstrid',$userId);
			$query = $this->db->get();
			return $query->result();
	}
	function Chip_history($UserID,$TypeID,$matchId,$MarketId,$OppAcID){
	//sourabh 161222
			$query =$this->db->query("call getChipHistory($TypeID,$UserID,$matchId,$MarketId,$OppAcID)");//sourabh 161222
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;

	}
	function online_users($userId,$userType){
			$query =$this->db->query("call getLoginUser($userId,$userType)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function Chip_summery($userId,$type){
			$query =$this->db->query("call sp_ChipSummary($userId,$type)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function profit_loss($userId,$sportId){
			$query =$this->db->query("call sp_GetP_L($userId,$sportId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function profit_loss1($userId,$sportId){
			$query =$this->db->query("call sp_getAllp_l($userId,$sportId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function matchOddsRes(){
			$this->db->select("res.selectionName,mtchmst.matchName,mrt.Name,res.id,res.selectionId,sprt.name");
			$this->db->from(' tblselectionname res');
			$this->db->join('matchmst mtchmst', 'mtchmst.MstCode=res.matchId', 'INNER');
			$this->db->join('market mrt', 'mrt.Id=res.marketId', 'INNER');
			$this->db->join('sportmst sprt', 'sprt.id=res.sportId', 'INNER');
			
			$query = $this->db->get();
			return $query->result();
	}
	function FancyRes(){
		
			$this->db->select("mf.HeadName,mf.MatchID,mf.TypeID,mtchmst.matchName");
			$this->db->from('matchfancy mf');
			$this->db->join('matchmst mtchmst', 'mtchmst.MstCode=mf.MatchID', 'INNER');
			
			$query = $this->db->get();
			return $query->result();
	}
	function ActiveMatchUsers($matchId){
			$this->db->select("DISTINCT(cm.mstruserid) as UserName,COUNT(cm.mstruserid) as cntBetting");
			$this->db->from('matchmst mmst');
			$this->db->join('tblbets bts', 'bts.MatchId=mmst.MstCode', 'INNER');
			$this->db->join('createmaster cm', 'cm.mstrid=bts.UserId', 'INNER');
			$this->db->where('bts.MatchId',$matchId);
			$this->db->group_by('cm.mstruserid'); 
			$query = $this->db->get();
			return $query->result();
	}
	function getActiveMatches(){
			$this->db->select("MstCode,matchName");
			$this->db->from('matchmst');
			$this->db->where('active',1);
			$query = $this->db->get();
			return $query->result();
	}
	function BetHistory($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}
			

			$query =$this->db->query("call GetBetHistory($userId1)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function AcStatement($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}
			$query =$this->db->query("call sp_acStatement($userId1)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
						
			return $res;
	}
	function adminLimit(){
			$this->db->select("*");
			$this->db->from('tblconfig');
			$query = $this->db->get();
			return $query->result();
	}
	function UpdateAdminLimit($id,$limit){
		$limitData = array('adminLImit'  => $limit);
        	$this->db->where('Id', $id);
		    $query=$this->db->update('tblconfig', $limitData);
		    return true;
	}
	function UpdateGngInPlayLimitLimit($limit){
			$limitData = array('InPlayStack'  => $limit);
        	$this->db->where('usetype', 3);
		    $query=$this->db->update('createmaster', $limitData);
		    return true;
	}
	function deleteGetbetting($betId,$userId){
		$query =$this->db->query("call SP_DelUnmatch($userId,$betId)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		echo $query;
	}
	function deleteGetbettingmat($betId,$userId,$marketId){
		$query =$this->db->query("call SP_DelMatch($userId,$betId,$marketId)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		echo $query;
	}
	
	function NewChip_historyP($userId,$type){
		$query =$this->db->query("call sp_ChipSumm_P($userId,$type)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $query;
	}
	function NewChip_historyM($userId,$type){
		$query =$this->db->query("call sp_ChipSumm_M($userId,$type)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $query;
	}
	function Chip_historyById($userId,$userType,$lgnType,$parentId,$FROMDate,$ToDate){
	
			$query =$this->db->query("call GetLedger($lgnType,$userId,$userType,$parentId,'$FROMDate','$ToDate')");//170201_3//getChipHistory
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function Chip_leger($userId,$userType,$selectType,$fromDate1,$ToDate1){
	   // echo $fromDate1;
       // echo $ToDate1;
	        if($fromDate1==null ||$ToDate1==null){
                //$fromDate2="''";
                //$ToDate2="''";
                //echo "true";
              //echo "call GetLedger($userType,$userId,$selectType,0,null,null)";
                $query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,null,null)");//170201
            }else{
                $fromDate2="'".$fromDate1."'";
               // echo"||";
                $ToDate2="'".$ToDate1."'";
                //echo "False";
               // echo "call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)";
                $query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)");//170201
            }

			//$query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)");//170201
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function GetPlusA_c($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call sp_PL_ChipSumm_P($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function GetMinusA_c($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call sp_PL_ChipSumm_M($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function BetHistoryPL($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call GetBetHistory_PL($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function setHeaderMsg(){
			$message=$_POST['setMessage'];
			//echo "call SetMarquee('$message')";
			$query =$this->db->query("call SetMarquee('$message')");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function DisplayMsgOnHeader(){			
			$query =$this->db->query("call GetMarquee()");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function UpdateNotification(){
			$this->db->trans_begin();	        	
			$notificationData = array('notificat_msg' =>$_POST['setMessage']);
			$updateUserData = array('notif_status' =>1);
			$query=$this->db->update('adminlimit', $notificationData);
			$query=$this->db->update('createmaster', $updateUserData);			
			if ($this->db->trans_status() === FALSE){
				$this->db->trans_rollback();
				return false;
			}else{
				$this->db->trans_commit();
				return true;
			}
		        	
	}
	function GetNotification(){
			$this->db->select("notificat_msg");
			$this->db->from('adminlimit');
			$query = $this->db->get();
			return $query->result();

	}
	function getNotifi_status($user_id){
			$this->db->select("notif_status");
			$this->db->where("mstrid", $user_id);
			$this->db->from('createmaster');
			$query = $this->db->get();
			return $query->result();
	}
	
	function updatenoti_status($user_id){
			$limitData = array('notif_status'  => 0);
        	$this->db->where("mstrid", $user_id);
		    $query=$this->db->update('createmaster', $limitData);
		    echo $this->db->last_query();
		    return true;
	}
	
	
	
}