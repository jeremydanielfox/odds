//
//  SignUpViewController.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit
import Alamofire

class SignUpViewController: UIViewController {
    @IBOutlet weak var usernameTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var confirmTF: UITextField!
    
    var curUser: User?

    override func viewDidLoad() {
        super.viewDidLoad()
        navigationController?.setNavigationBarHidden(false, animated: true)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func signUpPressed(_ sender: Any) {
        signUp()
    }

    func signUp() {
        usernameTF.resignFirstResponder()
        passwordTF.resignFirstResponder()
        confirmTF.resignFirstResponder()
        
        if usernameTF.text! != "" && passwordTF.text! != "" && confirmTF.text! != "" {
            if passwordTF.text! == confirmTF.text! {
                let parameters: Parameters = [
                    "username" : usernameTF.text!,
                    "password" : passwordTF.text!
                ]
                
                Alamofire.request("https://boiling-badlands-32237.herokuapp.com/addUser", method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
                    if response.result.isSuccess {
                        //save user in core data
                        if let JSON = response.result.value {
                            let dict = JSON as! Dictionary<String, String>
                            self.curUser = User(uid: Int(dict["uid"]!)!, name: self.usernameTF.text!, cred: 0)
                            self.performSegue(withIdentifier: "SignUpToOddsSegue", sender: self)
                        }
                    }
                }
            }
        }
    }
    

    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
        if let destinationVC = segue.destination as? MenuTableTableViewController {
            destinationVC.curUser = curUser
        }
    }


}
