<?php

defined('BASEPATH') OR exit('No direct script access allowed');

	class Loginauthcontroller extends CI_Controller {

		function __construct() {

		        parent::__construct();

                $_POST = json_decode(file_get_contents('php://input'), true);

		        $node1=$this->session->userdata('user_id');

		        $this->load->model('Modelchkuser');
		       // if ($this->session->userdata('user_id') != '') { } else { redirect(base_url());}

			}
		

		function chkLoginUser(){

            $user_data=$this->Modelchkuser->chkAuthName();

           // print_r($user_data);

            //die();

			if ($user_data['iType']==0) {

			    $getToken=$this->getACookie();

				$this->session->set_userdata('TokenId', $getToken);

				$data['type'] = $user_data['usetype'];

				$data['user_name'] = $user_data['mstruserid'];

				$data['user_id'] = $user_data['mstrid'];

            	                $data['error'] = $user_data['iType'];

				$data['message'] = $user_data['Msg'];

				$data['ChangePas'] = $user_data['ChangePas'];

				$data['TokenId'] = "yPAFq7YCIi/nVwwwGe1vr2IM/v+LtGxRvEhmHyzTbx8=";

				$data['set_timeout'] = $user_data['set_timeout'];

				$data['lgnstatus'] = $this->session->userdata('session_id');

				$data['last_login_id'] = $this->session->userdata('last_login_id');

				echo json_encode($data);

			}else{

                $data['error'] = $user_data['iType'];

                $data['message'] = $user_data['Msg'];

				echo json_encode($data);

			}

		}

		function adminDashboard(){

			$this->load->view('templates/adminDashboard');

		}
		function getUserIdandType(){
			 $node1=$this->session->userdata('user_id');
			 echo json_encode(array('user_id' => $this->session->userdata('user_id') ,'userType' => $this->session->userdata('type')));
		}
		function GetDynamicQuery($getData){
			echo $SQL=urldecode($getData);
			$query = $this->db->query($SQL);
			print_r($query->result_array());
		}

		function logout(){

			/*$logoutId = $this->session->userdata('last_login_id');

			$session_id = $this->session->userdata('session_id');*/

			//$user_data=$this->Modelchkuser->logoutentry($logoutId,$session_id,$userId);

			$user_data=$this->Modelchkuser->logoutentry();

			$this->session->sess_destroy();

			$data['message'] = "Logout";

			echo json_encode($data);

		}

		function is_logged_in() {



		   $user = $this->session->userdata('user_name');





		   if (empty($user)) { 

		  // 	$this->session->sess_destroy();

		   	//redirect(base_url());

		   		$data['data'] = 0;

				$data['status'] = 'Invalid User Name Or Password';

				//echo json_encode($data);

		       return $this->output->set_content_type('application/json')->set_output(json_encode($data));

		      //return false;

		   } 

		   else { 

		   		$data['data'] = 1;

				$data['status'] = 'Valid User Name Or Password';

				//echo json_encode($data);

		   		/*$data['data'] = 1;

				$data['status'] = 'valid';

				echo json_encode($data);*/

		      return $this->output->set_content_type('application/json')->set_output(json_encode($data));

				//return true;

		   }



		}

		function getACookie(){

	

						$loginEndpoint= "https://identitysso.betfair.com/api/login";

						

						$cookie = "";

						

						

						 $username = "akki3658";
						 $password = "rahul4477";
						/*$username = "balajiassociatesggn@gmail.com";
						$password = "samsung@1234";*/
						

						$login = "true";

						$redirectmethod = "POST";

						$product = "home.betfair.int";

						$url = "https://www.betfair.com/";



						$fields = array

							(

								'username' => urlencode($username),

								'password' => urlencode($password),

								'login' => urlencode($login),

								'redirectmethod' => urlencode($redirectmethod),

								'product' => urlencode($product),

								'url' => urlencode($url)

							);



						//open connection

						$ch = curl_init($loginEndpoint);

						//url-ify the data for the POST

						$counter = 0;

						$fields_string = "&";



						foreach($fields as $key=>$value) 

							{ 

								if ($counter > 0) 

									{

										$fields_string .= '&';

									}

								$fields_string .= $key.'='.$value; 

								$counter++;

							}



						rtrim($fields_string,'&');



						curl_setopt($ch, CURLOPT_URL, $loginEndpoint);

						curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

						curl_setopt($ch, CURLOPT_POST, true);

						curl_setopt($ch, CURLOPT_POSTFIELDS,$fields_string);

						curl_setopt($ch, CURLOPT_HEADER, true);  // DO  RETURN HTTP HEADERS

						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // DO RETURN THE CONTENTS OF THE CALL



						//execute post

						//print_r($ch);

						$result = curl_exec($ch);



						//echo $result;



						if($result == false) 

							{



                                echo "API RESPONSE FAILED...";

                                //die();

                                echo 'Curl error: ' . curl_error($ch);

							} 

						

						else 

							{

								$temp = explode(";", $result);

								$result = $temp[0];

								

								$end = strlen($result);

								$start = strpos($result, 'ssoid=');

								$start = $start + 6;

							

								$cookie = substr($result, $start, $end);

					                        

							}

						curl_close($ch);



						return $cookie;

	

		}

	function chkLoginStatus($userId){ 
            $data['status'] = $this->Modelchkuser->chkLoginStatus($userId); 
            return $this->output->set_content_type('application/json')->set_output(json_encode($data));
		}

}