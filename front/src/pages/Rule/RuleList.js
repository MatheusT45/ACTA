import React, { useState, useEffect } from "react";
import RuleCard from "./components/RuleCard";
import { Row, Col } from "react-bootstrap";
import api from "../../services/api";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Fade from '@material-ui/core/Fade';
import { useDispatch, useSelector } from "react-redux";

const styles = {
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  }
};
function RuleList (props) {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [rules, setRules] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getRules();
  },[])

  const getRules = () => {
    api.get("/rule")
      .then(async (res) => {
        await setRules(res.data.data)
        await setLoaded(true)
      })
  }

  /**
   * Receives roleID from child to delete 
   */
  const handleDelete = async (ruleID) => {
    api.delete(`/rule/${ruleID}`)
      .then((res) => {
        dispatch({type: 'SNACKBAR_SHOW', message: "Regra excluída com sucesso"})
        getRules();
      })
      .catch((err) => {
        dispatch({type: 'SNACKBAR_SHOW', message: "Houve um problema ao realizar esta ação"})
      });
  }
  return (
    <>
      <div>
        {rules.length > 0 && rules.map((item, index) =>
          <Row key={item.id}>
            <Col md={12}>
            <Fade 
              in={loaded}
              style={{ transformOrigin: '0 0 0' }}
              {...(loaded ? { timeout: (1000 * (index + 0.5))  } : {})}>
              <div>
                <RuleCard
                  history={props.history}
                  title={ item.rule_title }
                  text={ item.description }
                  ruleId={item.id}
                  handleDelete={handleDelete}
                  userIsAdmin={user.is_admin}
                />
              </div>
            </Fade>
            </Col>
          </Row>
        )}
        {loaded && rules.length === 0 ?
          <div style={{textAlign: "center", color: "white"}}>
            Nenhuma regra encontrada
          </div>
          :""}
      </div>
      { user.is_admin && 
        <Fab 
          color="primary" 
          style={styles.fab} 
          aria-label="add"
          onClick={() => props.history.push("/criar-regra")}
          title="Adicionar regra"
        >
        <AddIcon />
      </Fab>
      }
    </>
  );
}

export default RuleList;