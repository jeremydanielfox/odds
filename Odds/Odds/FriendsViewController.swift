//
//  FriendsViewController.swift
//  Odds
//
//  Created by Eric Saba on 10/13/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit
import Alamofire

class FriendsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    @IBOutlet weak var searchBar: UITextField!
    @IBOutlet weak var tableView: UITableView!
    var curUser: User?
    var friends: [User] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        getData()
    }
    
    func getData() {
        if let user = curUser {
            let parameters: Parameters = [ "uid" : user.getUID()]
            
            Alamofire.request("https://boiling-badlands-32237.herokuapp.com/getFriends", parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
                //save user in core data
                if let JSON = response.result.value {
                    let dicts = JSON as! [Dictionary<String, String>]
                    for dict in dicts {
                        self.friends.append(User(uid: Int(dict["uid"]!)!, name: dict["name"]!, cred: Int(dict["cred"]!)!))
                    }
                }
                self.tableView.reloadData()
            }
        }

    }
    
    override func viewDidAppear(_ animated: Bool) {
        getData()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return friends.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FriendCell", for: indexPath)
        
        cell.textLabel?.text = friends[indexPath.row].getName()
        return cell
    }
    @IBAction func addPressed(_ sender: AnyObject) {
        performSegue(withIdentifier: "AddFriendsSegue", sender: self)
    }

    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
        if let destinationVC = segue.destination as? AddFriendsViewController {
            destinationVC.curUser = curUser
        }
    }


}
