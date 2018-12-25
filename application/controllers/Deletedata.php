<?php
defined('BASEPATH') OR exit('No direct script access allowed');

	class Deletedata extends CI_Controller {
		function __construct() {
		        parent::__construct();
		        $this->load->model('Modelcreatemaster');
		        $_POST = json_decode(file_get_contents('php://input'), true);
		  		       
		    }
		function index(){ 
			$this->output->set_content_type('application/json')->set_output(json_encode($data)); 
		}
		function delete_all(){
		$this->load->model('Modelcreatemaster');			
			$this->Modelcreatemaster->Tuncate_matchlst();
			echo json_encode(array('error' => 0 ,'message' => 'Data Deleted '));
		}
	}